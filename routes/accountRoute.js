const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process the registration data
router.post(
  '/register', 
  regValidate.registrationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount)
)

// Default account route - Account Management (PROTECTED)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logout))

// Route to build account update view (GET)
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))

// Route to process account update (POST)
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to process password change (POST)
router.post(
  "/change-password",
  utilities.checkLogin,
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)

module.exports = router