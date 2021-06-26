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


// Container for produts / menu
const controller = {}

// View
controller.index = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page

    //
    res.writeHead( 200 ).end( JSON.stringify( { error : false, message : "ok !"} ) );        
  } 
};

// Export module
module.exports = controller;