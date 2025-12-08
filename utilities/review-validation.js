const { body, validationResult } = require("express-validator")
const reviewModel = require("../models/review-model")
const utilities = require("./index")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Validation rules for reviews
 * ********************************* */
validate.reviewRules = () => {
    return [
        // Validate rating
        body("review_rating")
            .trim()
            .notEmpty()
            .withMessage("Rating is required.")
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5 stars."),

        // Validate review text
        body("review_text")
            .trim()
            .notEmpty()
            .withMessage("Review text is required.")
            .isLength({ min: 10 })
            .withMessage("The review must be at least 10 characters long.")
            .isLength({ max: 1000 })
            .withMessage("The review cannot exceed 1000 characters.")
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.,!?¿¡\-()'"]+$/)
            .withMessage("The review contains invalid characters."),

        // Validate inv_id
        body("inv_id")
            .trim()
            .notEmpty()
            .withMessage("Vehicle ID is required.")
            .isInt()
            .withMessage("Invalid vehicle ID.")
    ]
}

/* ******************************
 * Check review data and return errors to the form
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
    const { review_rating, review_text, inv_id } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const invData = await invModel.getInventoryById(inv_id)

        res.render("inventory/detail", {
            errors,
            title: `${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`,
            nav,
            invData,
            review_rating,
            review_text,
            showReviewForm: true
        })
        return
    }
    next()
}

/* ******************************
 * Check if the user already submitted a review
 * ***************************** */
validate.checkDuplicateReview = async (req, res, next) => {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    try {
        const exists = await reviewModel.checkExistingReview(account_id, inv_id)

        if (exists) {
            req.flash("notice", "You have already submitted a review for this vehicle. You can edit it from your account.")
            res.redirect(`/inv/detail/${inv_id}`)
            return
        }
        next()
    } catch (error) {
        req.flash("notice", "Error checking existing reviews.")
        res.redirect(`/inv/detail/${inv_id}`)
    }
}

module.exports = validate
