// Needed Resources 
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const reviewValidate = require('../utilities/review-validation')

// Middleware to verify that the user is authenticated
const checkLogin = utilities.checkLogin || function (req, res, next) {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in to continue.")
        return res.redirect("/account/login")
    }
}

/* ***************************
 *  Review Routes
 * ************************** */

// Route to display add review form (authentication required)
router.get(
    "/add/:invId",
    checkLogin,
    utilities.handleErrors(reviewController.showAddReviewForm)
)

// Route to process new review (with validation)
router.post(
    "/add",
    checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    reviewValidate.checkDuplicateReview,
    utilities.handleErrors(reviewController.processReview)
)

// Route to display edit review form (authentication required)
router.get(
    "/edit/:reviewId",
    checkLogin,
    utilities.handleErrors(reviewController.showEditReviewForm)
)

// Route to process review update (with validation)
router.post(
    "/update",
    checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.updateReview)
)

// Route to delete review (authentication required)
router.get(
    "/delete/:reviewId",
    checkLogin,
    utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router
