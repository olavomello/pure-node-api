/*
  Ping Controller
*/
var { controllerMethods } = require('../helpers');

const controller = async ( req, res ) => {
  //
  if(  controllerMethods( req, res, ["GET"] ) ){
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