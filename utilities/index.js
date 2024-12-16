const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="nav-menu">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Details view HTML
* ************************************ */

Util.buildDetailsGrid = async function (data) {
  let inv
  inv = '<div id="details">'
  inv += '<img src="' + data[0].inv_image
  +'" alt="Image of ' + data[0].inv_make + ' ' + data[0].inv_model
  + ' on CSE Motors" />'
  inv += '<p>' + data[0].inv_make + ' ' + data[0].inv_model
  + ' details. </p>'
  inv += '<span>Price: $' 
  + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</span>'
  inv += '<p> Description: ' + data[0].inv_description + '</p>'
  inv += '<p> Color: ' + data[0].inv_color + '</p>'
  inv += '<span>Miles: ' 
  + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</span>'
  inv += '</div>'
  return inv
}

/* **************************************
* Build the classification list for the add new vehicle form 
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select id="classificationList" name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     res.locals.account_firstname = accountData.account_firstname
     res.locals.account_id = accountData.account_id
     // Check account type
     const accountType = accountData.account_type; 
     if (accountType === "Client") {
       res.locals.isClient = true;
     } else if (accountType === "Employee") {
       res.locals.isEmployee = true;
     } else if (accountType === "Admin") {
       res.locals.isAdmin = true;
     } else {
       res.locals.isClient = res.locals.isEmployee = res.locals.isManager = false;
     }
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */

 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please Log In")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check credentials
 * ************************************ */

 Util.checkCredentials = (req, res, next) => {
  if (res.locals.isEmployee || res.locals.isAdmin) {
    next()
  } else {
    req.flash("notice", "Please Log In to access inventory")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util