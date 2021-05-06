/*
  User Controller
*/
var { controllerMethods, fileAdd, uuid, userData, userExists } = require('../libs/helpers');

// Container
var controller = {};

// User > Get
controller.get = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute payload return

    // User token
    const token = String(arrPath[1]).trim();

    if( token ){
      // Token exist
      if( user = userData(token) ){
        // User exist
        res.end( JSON.stringify(user));
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
// User > Post
controller.add = async ( req, res ) => {
  //
  if(  controllerMethods( req, res, ["POST"] ) ){
    // Execute payload return >>>

    // Request body
    req.on( 'data', function(body) {

      if( body ){

        // Body parse
        body = JSON.parse( body );

        // Generate User uuid
        var token = uuid();

        // Test token creation
        if( !token ){
            // Generate token Error
            res.writeHead(404).end( JSON.stringify( { error   : true, message : "User unique id creation error." } ) );
            return;
        }

        // User container
        const user = {
          token,
          name     :   String(body.name).trim(),
          email    :   String(body.email).trim(),
          pass     :   String(body.pass).trim(),
          address  :   String(body.address).trim(),
          createAt :   Date.now()
        }

        // Check required parameters
        if( !( user.token && user.name && user.email && user.pass && user.address ) ){
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "User required parameters is empty." } ) );
          return;
        }

        // Check if user email exists
        if( userExists( user.email ) ){
          // User exists
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "User exists." } ) ); 
          return;
        }

        // Create file
        fileAdd( token, user, "users", function( err ){
          // Error creating file
          if( err ) {
            res.writeHead(404).end( JSON.stringify( { error   : true, message : "User file creation error." } ) );  
            return;
          }
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