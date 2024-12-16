/**
 * Account Controller
 */

const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accntCont = {};

/**
 * Deliver log in view
 */

accntCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Log in",
    nav,
    errors: null,
  });
};

/**
 *  Deliver registration view
 */

accntCont.buildRegistration = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Deliver account management view
 * *************************************** */

accntCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/management", {
    title: "Account management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
accntCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accntCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

accntCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password} = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email
    })
    return 
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
      if (process.env.NODE_ENV == 'development') {
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/**
 *  Deliver account management view
 */

accntCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build the edit account form page
 * ************************** */

accntCont.buildEditAccountForm = async function (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountbyAccountId(account_id)
  const accountName = `${accountData[0].account_firstname} ${accountData[0].account_lastname}`
  res.render("./account/update-view", {
    title: "Edit " + accountName,
    nav,
    errors: null,
    account_firstname: accountData[0].account_firstname,
    account_lastname: accountData[0].account_lastname,
    account_email: accountData[0].account_email
  })
}

/* ****************************************
 *  Update account data
 * *************************************** */

accntCont.updateAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body;

  const updateResult = await accountModel.updateAccount( 
    account_firstname,
    account_lastname,
    account_email,
    account_id
  ); 

  if (updateResult) {
    const accountName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${accountName} was successfully updated.`);
    res.redirect("/account/");
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-view", {
    title: "Edit " + accountName,
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    });
  }
}

/* ****************************************
 *  Log user out
 * *************************************** */

accntCont.accountLogout = function (req, res) {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV !== 'development', // Use `secure` in production
    });

    // Optionally flash a logout success message
    req.flash("notice", "You have been successfully logged out.");

    // Redirect to the login page or homepage
    res.redirect("/account/login");
  } catch (error) {
    console.error("Error during logout:", error.message);
    req.flash("error", "An error occurred while logging out. Please try again.");
    res.redirect("/account/");
  }
};

/* ****************************************
 *  Update password data
 * *************************************** */

accntCont.updatePassword = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_password,
    account_id,
  } = req.body;

  const updateResult = await accountModel.updatePassword( 
    account_password,
    account_id
  ); 

  if (updateResult) {
    const accountName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${accountName} was successfully updated.`);
    res.redirect("/account/");
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-view", {
    title: "Edit " + accountName,
    nav,
    errors: null,
    account_password,
    account_id,
    });
  }
}


module.exports = accntCont;