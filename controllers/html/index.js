/*
  Index Page
*/

var { 
    controllerMethods,
    fileRead,
    uuid,
    fileAdd,
    fileExists,
    tokenUpdate
} = require('../../libs/helpers');

// Container
const controller = {}

// View
controller.index = async ( req, res, arrPath ) => {

  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    res.writeHead( 200 ).end( "Hello world !" );        
  }

};

// Export module
module.exports = controller;