// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view (PÚBLICO - sin middleware)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle detail view (PÚBLICO - sin middleware)
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleDetail))

// Route to build inventory management view (PROTEGIDO)
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView))

// Route to build add classification view (PROTEGIDO)
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification (PROTEGIDO)
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.classificationRules(),      
  invValidate.checkClassificationData,    
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view (PROTEGIDO)
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory (PROTEGIDO)
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),           
  invValidate.checkInventoryData,         
  utilities.handleErrors(invController.addInventory)
)

// Route to get inventory by classification_id as JSON (AJAX - sin protección especial)
router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit inventory view (PROTEGIDO)
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route to process inventory update (PROTEGIDO)
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view (PROTEGIDO)
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirmation))

// Route to process inventory deletion (PROTEGIDO)
router.post("/delete", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router