/*
  Products Controller
*/

var { 
    controllerMethods,
    fileRead,
    tokenUpdate
} = require('../../libs/helpers');

// Container for produts / menu
const controller = {}

// Constants
const _PRODUCTS = [
    {
        id      : 1,
        name    : "Coke",
        price   : 1.00
    },
    {
        id      : 2,
        name    : "Beer",
        price   : 2.00
    },
    {
        id      : 3,
        name    : "Ice Cream",
        price   : 3.00
    },
    {
        id      : 4,
        name    : "Cheese Burguer",
        price   : 4.00
    },
    {
        id      : 5,
        name    : "Pizza",
        price   : 5.00
    }                                         
];

// Menu
controller.menu = async ( req, res, arrPath ) => {
    //
    if(  controllerMethods( req, res, ["GET"] ) ){
      // Execute payload return
  
      // User token
      var token = String(req.headers.token).trim();
      // Token validation
      token     = ( token && token != "undefined" ? token : false );
  
      if( token ){
        // Token exist
        if( userLogged = fileRead(token,"tokens") ){
    
          // Check token expiration
          if( userLogged.expire < Date.now()) {
            // Token expired
            res.writeHead( 404 ).end( JSON.stringify( { error : false, message : "Token expired. Please do login again."} ) );            
          } else {
            // Token ok and User exist
        
            // Update user token
            tokenUpdate(req);
                        
            res.end( JSON.stringify(_PRODUCTS));          
          }
        } else {
          // User does not exist
          res.writeHead( 200 ).end( JSON.stringify( { error : false, message : "User not found"} ) );        
        }
      } else {
        // Token does not passed
        res.writeHead( 404 );
        // Return // payload
        const payload = {
          error   : true,
          message : "User token empty"
        }
        res.end( JSON.stringify( payload ) );
      } 
    }
  };

// Return product list
controller.list = function( req, res, arrPath ){
    return JSON.stringify(_PRODUCTS);
}

// Export module
module.exports = { PRODUCTS : _PRODUCTS, controller };