/*
  Ping Controller
*/
var { controllerMethods } = require('../libs/helpers');

// Container
const controller = {};

controller.ping = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["GET","POST"] ) ){
    // Execute payload return
    res.writeHead( 200 );
    // Return // payload
    const payload = {
      error   : false,
      status  : "ok "
    }
    res.end( JSON.stringify( payload ) ); 
  }
};

// Export the module.
module.exports = controller;