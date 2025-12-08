const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 *  Show form to add review
 * ************************** */
reviewCont.showAddReviewForm = async function (req, res, next) {
    try {
        const inv_id = parseInt(req.params.invId)
        const invData = await invModel.getInventoryById(inv_id)

        if (!invData) {
            req.flash("notice", "The vehicle does not exist.")
            return res.redirect("/")
        }

        // Verify if the user has already made a review
        const account_id = res.locals.accountData.account_id
        const hasReview = await reviewModel.checkExistingReview(account_id, inv_id)

        if (hasReview) {
            req.flash("notice", "You have already made a review for this vehicle.")
            return res.redirect(`/inv/detail/${inv_id}`)
        }

        let nav = await utilities.getNav()
        res.render("reviews/add-review", {
            title: `Review: ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`,
            nav,
            errors: null,
            invData,
            review_rating: null,
            review_text: null
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Process new review
 *  ← MODIFIED: Renders directly with message
 * ************************** */
reviewCont.processReview = async function (req, res, next) {
    const { review_rating, review_text, inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    try {
        const result = await reviewModel.addReview(
            account_id,
            inv_id,
            review_rating,
            review_text
        )

        if (result) {
            req.flash("notice", "Thank you for your review! It has been published successfully.")

            // ← IMPORTANT: Use redirect so the flash message shows on the next load
            return res.redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Error publishing the review. Please try again.")
            return res.redirect(`/review/add/${inv_id}`)
        }
    } catch (error) {
        if (error.code === '23505') {
            req.flash("notice", "You have already made a review for this vehicle.")
            return res.redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Error processing the review.")
            next(error)
        }
    }
}

/* ***************************
 *  Show form to edit review
 * ************************** */
reviewCont.showEditReviewForm = async function (req, res, next) {
    try {
        const review_id = parseInt(req.params.reviewId)
        const reviewData = await reviewModel.getReviewById(review_id)

        if (!reviewData) {
            req.flash("notice", "Review not found.")
            return res.redirect("/account")
        }

        // Verify that the user is the owner of the review
        if (reviewData.account_id !== res.locals.accountData.account_id) {
            req.flash("notice", "You do not have permission to edit this review.")
            return res.redirect("/account")
        }

        const invData = await invModel.getInventoryById(reviewData.inv_id)
        let nav = await utilities.getNav()

        res.render("reviews/edit-review", {
            title: `Edit Review: ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`,
            nav,
            errors: null,
            invData,
            review_id: reviewData.review_id,
            review_rating: reviewData.review_rating,
            review_text: reviewData.review_text
        })
    } catch (error) {
        next(error)
    }
}

/* ***************************
 *  Process review update
 *  ← MODIFIED: Renders directly with message
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
    const { review_id, review_rating, review_text, inv_id } = req.body

    try {
        const result = await reviewModel.updateReview(
            review_id,
            review_rating,
            review_text
        )

        if (result) {
            req.flash("notice", "The review has been updated successfully.")
            return res.redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Error updating the review.")
            return res.redirect(`/review/edit/${review_id}`)
        }
    } catch (error) {
        req.flash("notice", "Error processing the update.")
        next(error)
    }
}

/* ***************************
 *  Delete review
 *  ← MODIFIED: Renders directly with message
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
    const review_id = parseInt(req.params.reviewId)
    const account_id = res.locals.accountData.account_id

    try {
        const reviewData = await reviewModel.getReviewById(review_id)

        if (!reviewData) {
            req.flash("notice", "Review not found.")
            return res.redirect("/account")
        }

        if (reviewData.account_id !== account_id) {
            req.flash("notice", "You do not have permission to delete this review.")
            return res.redirect("/account")
        }

        const inv_id = reviewData.inv_id
        const deleteResult = await reviewModel.deleteReview(review_id)

        if (deleteResult) {
            req.flash("notice", "The review has been deleted.")
            return res.redirect(`/inv/detail/${inv_id}`)
        } else {
            req.flash("notice", "Error deleting the review.")
            return res.redirect(`/inv/detail/${inv_id}`)
        }
    } catch (error) {
        req.flash("notice", "Error processing the deletion.")
        next(error)
    }
}
/* ***************************
 *  Get reviews from a user (for the account page)
 * ************************** */
reviewCont.getUserReviews = async function (req, res, next) {
    const account_id = res.locals.accountData.account_id

    try {
        const reviews = await reviewModel.getReviewsByAccountId(account_id)
        return reviews
    } catch (error) {
        next(error)
    }
}

module.exports = reviewCont
