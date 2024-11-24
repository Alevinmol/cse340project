const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory id
 * ************************** */

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const details = await utilities.buildDetailsGrid(data)
  let nav = await utilities.getNav()
  const detailName = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/detail", {
    title: detailName,
    nav,
    details,
  })
}

/* ***************************
 *  Build vehicle management page
 * ************************** */

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build the add new classification form page
 * ************************** */

invCont.buildClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/newClassification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build the add new vehicle form page
 * ************************** */

invCont.buildVehicleForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/newVehicle", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
 *  Process new Classification
 * *************************************** */

invCont.addNewClassification= async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_name
  } = req.body;

  const classResult = await invModel.addNewClassification(
    classification_name
  );

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you added a new classification`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the adding of a new classification failed.");
    res.status(501).render("inventory/newClassification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process new Classification
 * *************************************** */

invCont.addNewVehicle= async function (req, res) {
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const classResult = await invModel.addNewVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  );

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you added a ${inv_make} ${inv_model} vehicle`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the adding of a new vehicle failed.");
    res.status(501).render("inventory/newVehicle", {
      title: "Add Vehicle",
      nav,
      errors: null,
    });
  }
}

module.exports = invCont