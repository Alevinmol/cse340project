// Needed resourses
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const accntCont = require("../controllers/accountController")

// Deliver account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Deliver log in view
router.get("/login", utilities.handleErrors(accountController.buildLogin)) 

// Deliver registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration))

// Deliver the update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildEditAccountForm))

// Handle the logout process 
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Handles registration
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accntCont.accountLogin)
)

// Process the update information attempt
router.post(
  "/update",
  utilities.handleErrors(accntCont.updateAccount)
)

// Process the password change 
router.post(
  "/password",
  utilities.handleErrors(accntCont.updatePassword)
)
  
module.exports = router