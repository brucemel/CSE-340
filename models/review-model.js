const pool = require("../database/")

/* ***************************
 *  Add new review
 * ************************** */
async function addReview(account_id, inv_id, review_rating, review_text) {
    try {
        const sql = `
      INSERT INTO reviews (account_id, inv_id, review_rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
        const result = await pool.query(sql, [account_id, inv_id, review_rating, review_text])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Get all reviews for a vehicle
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
    try {
        const sql = `
      SELECT 
        r.review_id,
        r.account_id,
        r.review_rating,
        r.review_text,
        r.review_date,
        a.account_firstname,
        a.account_lastname,
        CONCAT(SUBSTRING(a.account_firstname, 1, 1), SUBSTRING(a.account_lastname, 1, 1)) as initials
      FROM reviews r
      INNER JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
        const result = await pool.query(sql, [inv_id])
        return result.rows
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
    try {
        const sql = `
      SELECT 
        ROUND(AVG(review_rating), 1) as avg_rating,
        COUNT(*) as review_count
      FROM reviews
      WHERE inv_id = $1
    `
        const result = await pool.query(sql, [inv_id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Check if the user already submitted a review
 * ************************** */
async function checkExistingReview(account_id, inv_id) {
    try {
        const sql = `
      SELECT review_id
      FROM reviews
      WHERE account_id = $1 AND inv_id = $2
    `
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rowCount > 0
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Get review by ID
 * ************************** */
async function getReviewById(review_id) {
    try {
        const sql = `
      SELECT 
        r.*,
        a.account_firstname,
        a.account_lastname
      FROM reviews r
      INNER JOIN account a ON r.account_id = a.account_id
      WHERE r.review_id = $1
    `
        const result = await pool.query(sql, [review_id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Update review
 * ************************** */
async function updateReview(review_id, review_rating, review_text) {
    try {
        const sql = `
      UPDATE reviews
      SET review_rating = $1,
          review_text = $2
      WHERE review_id = $3
      RETURNING *
    `
        const result = await pool.query(sql, [review_rating, review_text, review_id])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Delete review
 * ************************** */
async function deleteReview(review_id) {
    try {
        const sql = `
      DELETE FROM reviews
      WHERE review_id = $1
    `
        await pool.query(sql, [review_id])
        return true
    } catch (error) {
        throw error
    }
}

/* ***************************
 *  Get all reviews by an account
 * ************************** */
async function getReviewsByAccountId(account_id) {
    try {
        const sql = `
      SELECT 
        r.*,
        i.inv_make,
        i.inv_model,
        i.inv_year
      FROM reviews r
      INNER JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `
        const result = await pool.query(sql, [account_id])
        return result.rows
    } catch (error) {
        throw error
    }
}

module.exports = {
    addReview,
    getReviewsByInventoryId,
    getAverageRating,
    checkExistingReview,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByAccountId
}
