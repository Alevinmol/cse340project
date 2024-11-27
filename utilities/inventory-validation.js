const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/**
 * New Classification data validation rules
 */

validate.newClassificationRules = () => {
    return [
        // classification name is required and must be string 
        body("classification_name")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Please provide a correct classification name.")
            /**.custom(async (classification_name) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please enter a new classification")
                } 
            }), */
    ]
}

/**
 *  Check data and return errors or continue to add new classification 
 */

validate.checkClassData = async (req, res, next) => {
    const { classification_name} =
    req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/newClassification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
    return
    }
    next()
}

/**
 * New Vehicle data validation rules
 */

validate.addNewVehicleRules = () => {
    return [
        // make is required and must be a string
        body("inv_make")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."),
        
        // model is required and must be string 
        body("inv_model")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .withMessage("Please provide a model name."),

        // year is required and must be 4 digits 
        body("inv_year")
            .notEmpty()
            .isInt({ min: 1000 })
            .isInt({ max:9999 })
            .withMessage("Please provide a valid year."),

        // description is required and must be string 
        body("inv_description")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),

        // price is required and must have no spaces or comas 
        body("inv_price")
            .notEmpty()
            .isInt()
            .withMessage("Please provide a valid price with no comas or spaces."),
        
        // miles is required and must have no spaces or comas 
        body("inv_miles")
            .notEmpty()
            .isInt()
            .withMessage("Please provide a valid amount of miles with no comas or spaces."),
        
        // color is required and must be string 
        body("inv_color")
            .trim()
            .isString()
            .isLength({ min: 1 })
            .withMessage("Please provide a color."),
    ]
}

/**
 *  Check data and return errors or continue to add new classification 
 */

validate.checkVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color} =
    req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()
        res.render("./inventory/newVehicle", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
        })
    return
    }
    next()
}

module.exports = validate