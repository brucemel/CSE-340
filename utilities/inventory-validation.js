const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z]+$/)
      .withMessage("Classification name must contain only alphabetic characters (no spaces or special characters)."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_img")  // ← inv_img (correcto)
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number."),

    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Year must be a 4-digit number."),

    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Miles must be a number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_img,  // ← inv_img (correcto)
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color 
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_img,  // ← inv_img (correcto)
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 * Check update data and return errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id,
    inv_make, 
    inv_model, 
    inv_year,
    inv_description,
    inv_img,  // ← CAMBIO AQUÍ
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_img,  // ← CAMBIO AQUÍ
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate