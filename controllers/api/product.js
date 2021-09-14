/*
  Products Controller
*/

var {
  fileRead,
  controllerMethods
} = require("../../libs/helpers");

// Container for produts / menu
//const controller = {}

// Constants
const _PRODUCTS = fileRead("data","products");

// Menu
menu = async (req, res, arrPath) => {
  //
  if (controllerMethods(req, res, ["GET"])) {
    // Execute payload return
    res.end(JSON.stringify(_PRODUCTS));
  }
};

// Return product list
list = function (req, res, arrPath) {
  return JSON.stringify(_PRODUCTS);
};

// Return product view / item
product = function (req, res, arrPath) {
  req.on( 'data', function(body) {
    if( body ){
      // Body parse
      body = JSON.parse( body );

      // Id
      let { id } = body;
      if( id ){
        // Find product
        const item = _PRODUCTS.filter( (product) => product.id == id );
        // Return
        return res.writeHead(200).end( JSON.stringify( item ) );
      } else {
        return res.writeHead(404).end( JSON.stringify( { error   : true, message : "Parameter ID required." } ) );
      }
    } else {
      return res.writeHead(404).end( JSON.stringify( { error   : true, message : "Parameter ID required." } ) );
    }
  });
};

// Export module
module.exports = { PRODUCTS: _PRODUCTS, menu, list, product };
