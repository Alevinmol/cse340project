// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build Managment view 
router.get("/", utilities.checkCredentials, utilities.handleErrors(invController.buildManagement));

// Route to build Add new Classification form view
router.get("/newClassification", utilities.handleErrors(invController.buildClassificationForm))

// Route to build Add new Vehicle form view
router.get("/newVehicle", utilities.handleErrors(invController.buildVehicleForm))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by each individual vehicule view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the get inventory by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit inventory by id
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditVehicleForm))

// Route to build the delete form
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteVehicleForm))

// Handles the delete form 
router.post("/delete",
    utilities.handleErrors(invController.DeleteInventory))

//Handles the new Classification form
router.post("/newClassification",
    invValidate.newClassificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addNewClassification))

//Handles the new Vehecle form
router.post("/newVehicle",
    invValidate.addNewVehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle))

// Handles the edit form 
router.post("/update",
    invValidate.addNewVehicleRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;