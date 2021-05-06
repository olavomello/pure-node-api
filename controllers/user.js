/*
  User Controller
*/
var { controllerMethods } = require('../helpers');

// Container
var controller = {};

// User > Get
controller.get = async ( req, res ) => {
  //
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute payload return
    res.writeHead( 200 );
    // Return // payload
    const payload = {
      error   : false,
      message : "User get"
    }
    res.end( JSON.stringify( payload ) ); 
  }
};
// User > Post
controller.add = async ( req, res ) => {
  //
  if(  controllerMethods( req, res, ["POST"] ) ){
    // Execute payload return
    res.writeHead( 200 );
    // Return // payload
    const payload = {
      error   : false,
      message : "User add"
    }
    res.end( JSON.stringify( payload ) ); 
  }
};

// Export the module.
module.exports = controller;