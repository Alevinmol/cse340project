// Needed resourses
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Deliver log in view
router.get("/login", utilities.handleErrors(accountController.buildLogin)) 

// Deliver registration view
router.get("/register",utilities.handleErrors(accountController.buildRegistration))

// Handles registration

router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router