/*
  User Controller
*/
var { controllerMethods, fileAdd, uuid } = require('../libs/helpers');
var User = require('../models/user');

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
    // Execute payload return >>>

    // Generate User uuid
    var id = uuid();
    console.log(id);
    // Request body
    var body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    console.log(body);

    // User container
    var user = User;

    // Create file
    fileAdd( file, data, "users", function( err ){
      if( err ){
        // Error creating file
        res.writeHead( 404 );
        res.end( JSON.stringify( { error   : true, message : "User file creation error." } ) );         
      } else {
        // File created
        // Error creating file
        res.writeHead( 200 );
        res.end( JSON.stringify( { error   : false, message : "User created." } ) );         
      }
    });
  }
};

// Export the module.
module.exports = controller;