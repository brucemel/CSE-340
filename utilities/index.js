const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul class="ulnav">'
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
      grid += '<li class="cardscar">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr/>'
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
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = function(vehicle) {
  // Como inv_image no existe, construir la ruta desde inv_thumbnail
  // Quitar el "-tn" para obtener la imagen grande
  let imagePath = vehicle.inv_thumbnail
  if (imagePath) {
    imagePath = imagePath.replace('-tn', '')  // batmobile-tn.jpg → batmobile.jpg
  } else {
    imagePath = '/images/no-image.jpg'
  }
  
  let detail = `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${imagePath}" 
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
      </div>
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        
        <p class="vehicle-price">
          <strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}
        </p>
        
        <p class="vehicle-description">
          <strong>Description:</strong> ${vehicle.inv_description}
        </p>
        
        <p class="vehicle-color">
          <strong>Color:</strong> ${vehicle.inv_color}
        </p>
        
        <p class="vehicle-miles">
          <strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}
        </p>
      </div>
    </div>
  `
  return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
