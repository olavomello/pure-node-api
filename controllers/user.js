/*
  User Controller
*/
var { 
        controllerMethods, 
        fileAdd, 
        uuid, 
        userExists, 
        userDataByEmail, 
        fileUpdate, 
        tokenData,
        fileRead,         
        fileDelete,
        listUserToken,
        tokenUpdate
    } = require('../libs/helpers');

// Container
const controller = {};

// User > Get
controller.get = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute payload return

    // User token
    var token = String(req.headers.token).trim();
    // Token validation
    token     = ( token && token != "undefined" ? token : false );

    if( token ){
      // Token exist
      if( userLogged = fileRead(token,"tokens") ){
  
        // Check token expiration
        if( userLogged.expire < Date.now()) {
          // Token expired
          res.writeHead( 404 ).end( JSON.stringify( { error : false, message : "Token expired. Please do login again."} ) );            
        } else {
          // Token ok and User exist

          // Update user token
          tokenUpdate(req);

          // Return
          res.end( JSON.stringify(userLogged));          
        }
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
// User > Add
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
        var id = uuid();

        // Test id creation
        if( !id ){
            // Generate id Error
            res.writeHead(404).end( JSON.stringify( { error   : true, message : "User unique id creation error." } ) );
            return;
        }

        // User container
        const user = {
          id,
          name     :   String(body.name).trim(),
          email    :   String(body.email).trim(),
          pass     :   String(body.pass).trim(),
          address  :   String(body.address).trim(),
          createAt :   Date.now()
        }

        // Check required parameters
        if( !( user.name && user.email && user.pass && user.address ) ){
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "Parameter(s) required(s)." } ) );
          return;
        }

        // Check if user email exists
        if( userExists( user.email ) ){
          // User exists
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "User exists." } ) ); 
          return;
        }
        
        // Create file
        fileAdd( id, user, "users", function( err ){
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
// User > Update
controller.update = async ( req, res ) => {
  //
  if(  controllerMethods( req, res, ["PUT"] ) ){
    // Execute payload return >>>

    // Request body
    req.on( 'data', function(body) {

      if( body ){

        // Body parse
        body = JSON.parse( body );

        // User token
        var token = String(req.headers.token).trim();
        // Token validation
        token     = ( token && token != "undefined" ? token : false );

        // Check required parameters
        if( !token ){
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "Token empty." } ) );
          return;
        } else if( !( userLogged = tokenData(token) ) ) {
          // Token not found
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "Invalid token or token not found ." } ) );
          return;          
        }
        
        // Check token expiration
        if( userLogged.expire < Date.now()) {
          // Token expired
          res.writeHead( 404 ).end( JSON.stringify( { error : false, message : "Token expired. Please do login again."} ) );   
          return;         
        }   

        // Check user id
        if( !userLogged.user.id ) {
          // User id not found
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "User id not found." } ) );
          return;          
        }        

        // Update user token
        tokenUpdate(req);

        // User container
        const user = {
          id        :   userLogged.user.id,
          name      :   String(body.name).trim(),
          email     :   String(body.email).trim(),
          pass      :   String(body.pass).trim(),
          address   :   String(body.address).trim(),
          createAt  :   userLogged.user.createAt,
          updatedAt :   Date.now()
        }

        // Check required parameters
        if( !( user.name && user.email && user.pass && user.address ) ){
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "Parameter(s) required(s)." } ) );
          return;
        }

        // Check if user email exists
        if( userDataByEmail( user.email, userLogged.user.id ) ){
          // User exists
          res.writeHead(404).end( JSON.stringify( { error   : true, message : "This e-mail was used." } ) ); 
          return;
        }
        
        // Create file
        fileUpdate( userLogged.user.id, user, "users", function( err ){
          // Error creating file
          if( err ) {
            res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error updating user data." } ) );  
            return;
          }
        });

        // User created
        res.writeHead(200).end( JSON.stringify( { error : false, message : "User updated.", user } ) );   

      } else {
        // No data sent
        res.writeHead(404).end( JSON.stringify( { error   : true, message : "User data empty." } ) );  
      }
            
    });  
  }
};
// User > Login
controller.login = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["POST"] ) ){
    // Execute payload return

    // Request body
    req.on( 'data', function(body) {
      // Ready body data
      body = JSON.parse( body );

      // User data passed by headers
      var email =   String(body.email).trim();
      var pass  =   String(body.password).trim();
      // Login validation
      email     =   ( email && email != "undefined" ? email : false );
      pass      =   ( pass  && pass  != "undefined" ? pass  : false );

      // Check if user email exists
      if( email && pass ){
        // User exists ?
        if( user = userDataByEmail(email) ){
            // User exist
            if( user.email == email && user.pass == pass  ){
              // Valid login
              
              // Generate User uuid
              var token = uuid();
              // Test token creation
              if( !token ){
                  // Generate token Error
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "User unique id creation error." } ) );
                  return;
              }

              // User data
              const tokenExpire = ( Date.now() + ( 60*60*1000 ) ); // 60 minutes
              const userLogged  = { auth : true, token, expire : tokenExpire, user };

              // Update user file
              fileAdd( token, userLogged, "tokens", function( err ){
                // Error creating file
                if( err ) {
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "Token file creation error." } ) );  
                  return;
                }
              });              

              // Return              
              res.writeHead(200).end( JSON.stringify( { error   : false, message : "Login successful", userLogged } ) ); 
              return;
            } else {
              // Invalid login
              res.writeHead(404).end( JSON.stringify( { error   : true, message : "Invalid login." } ) ); 
              return;            
            }            
        } else {
          // User does not exist
          res.writeHead( 200 ).end( JSON.stringify( { error : false, message : "User not found"} ) );        
        }
      } else {
        // User does not exist // Invalid email
        res.writeHead(404).end( JSON.stringify( { error   : true, message : "E-mail and password required." } ) ); 
        return;
      }
    });
  }
};
// User > Delete
controller.delete = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["DELETE"] ) ){
    // Execute payload return

    // Request body
    req.on( 'data', function(body) {
      // Ready body data
      body = JSON.parse( body );

      // User data passed by headers
      var email =   String(body.email).trim();
      var pass  =   String(body.pass).trim();
      // Login validation
      email     =   ( email && email != "undefined" ? email : false );
      pass      =   ( pass  && pass  != "undefined" ? pass  : false );

      // Check if user email exists
      if( email && pass ){
        // User exists ?
        if( user = userDataByEmail(email) ){
            // User exist
            if( user.email == email && user.pass == pass  ){
              // Valid login

              // User token
              var token = String(req.headers.token).trim();
              // Token validation
              token     = ( token && token != "undefined" ? token : false );

              // Check required parameters
              if( !token ){
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Token empty." } ) );
                return;
              } else if( !( userLogged = tokenData(token) ) ) {
                // Token not found
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Invalid token or token not found ." } ) );
                return;          
              }

              // Check token expiration
              if( userLogged.expire < Date.now()) {
                // Token expired
                res.writeHead( 404 ).end( JSON.stringify( { error : false, message : "Token expired. Please do login again."} ) );   
                return;         
              }   

              // Check user id
              if( !userLogged.user.id ) {
                // User id not found
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "User id not found." } ) );
                return;          
              }   
                            
              // Delete user file
              if( fileDelete(userLogged.user.id, "users") ) {
                // User Deleted

                // List tokens
                const arrTokens = listUserToken(userLogged.user.id);

                // Delete token files
                arrTokens.map( (tokenId) => { 
                  if( fileDelete(tokenId, "tokens") ){
                    // Token deleted
                    // console.log("Token deleted : ", tokenId);
                  } else {
                    // Token not found
                    // console.log("Error trying to delete token : ", tokenId);
                  }
                });

                // Deleted              
                res.writeHead(200).end( JSON.stringify( { error   : false, message : "User deleted !" } ) ); 
                return;
              } else {
                // Deletion error             
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error deleting user !" } ) ); 
                return;                
              }
            } else {
              // Invalid login
              res.writeHead(404).end( JSON.stringify( { error   : true, message : "Invalid login." } ) ); 
              return;            
            }            
        } else {
          // User does not exist
          res.writeHead( 200 ).end( JSON.stringify( { error : true, message : "User not found"} ) );        
        }
      } else {
        // User does not exist // Invalid email
        res.writeHead(404).end( JSON.stringify( { error   : true, message : "E-mail and password required." } ) ); 
        return;
      }
    });
  }
};

// Export the module.
module.exports = controller;