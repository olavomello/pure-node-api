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
      res.end( JSON.stringify(_PRODUCTS));
    }
  };

// Return product list
controller.list = function( req, res, arrPath ){
    return JSON.stringify(_PRODUCTS);
}

// Export module
module.exports = { PRODUCTS : _PRODUCTS, controller };