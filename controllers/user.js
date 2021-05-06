/*
  User Controller
*/
var { controllerMethods, fileAdd, uuid, apiBody } = require('../libs/helpers');

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
    req.on( 'data', function(body) {

      if( body ){

        body = JSON.parse( body );

        // User container
        const user = {
          token,
          name     :   body.name,
          email    :   body.email,
          pass     :   body.pass,
          address  :   body.address,
          createAt :   Date.now()
        }

        // Check required parameters
        if( !( user.token && user.name && user.email && user.pass && user.address ) ){
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "User required parameters is empty." } ) );
          return;
        }

        // Create file
        fileAdd( token, user, "users", function( err ){
          // Error creating file
          if( err ) res.writeHead(404).end( JSON.stringify( { error   : true, message : "User file creation error." } ) );  
        });

        // User created
        res.writeHead(200).end( JSON.stringify( { error : false, message : "User created.", user } ) );   

      } else {
        // No data sent
        res.writeHead(404).end( JSON.stringify( { error   : true, message : "User data empty." } ) );  
      }
            
    });  
  }
};

// Export the module.
module.exports = controller;