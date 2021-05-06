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
    var token = uuid();

    // Request body
    var body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    console.log("Body > ", body);

    // User container
    var user      =   User;

    // User data
    user.token    =   token;
    user.name     =   "";
    user.email    =   "";
    user.pass     =   "";
    user.address  =   "";

    // Create file
    fileAdd( token, user, "users", function( err ){
      // Error creating file
      if( err ) res.writeHead(404).end( JSON.stringify( { error   : true, message : "User file creation error." } ) );  
    });

    // User created
    res.writeHead(200).end( JSON.stringify( { error : false, message : "User created.", user : user } ) );     
  }
};

// Export the module.
module.exports = controller;