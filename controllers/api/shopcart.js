/*
  Shopcart Controller
*/

var { 
    controllerMethods,
    fileRead,
    uuid,
    fileAdd,
    fileUpdate,
    fileExists,
    tokenUpdate
} = require('../../libs/helpers');

// Products list
const { PRODUCTS } = require('../../controllers/api/product');

// Container for produts / menu
const controller = {}

// Shopcart viewx
controller.view = async ( req, res, arrPath ) => {
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
          // ------------------------------------------------
          // Token ok and User exist
          
          // Update user token
          tokenUpdate(req);

          if( !fileExists(token, "shopcart") ){
            // Shopcart doesn't exist
            res.writeHead(200).end( JSON.stringify( { error   : false, message : "Shopcart is empty." } ) );  
          } else {
            // Shopcart exists // Open shopcart file
            var blnError = false;
            const shopcartData = fileRead(token, "shopcart", function( err ){
              blnError = ( err ? true : false );
            });
            if( blnError ) {
              res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error reading shopcart." } ) );  
            } else {
              // Return shopcart
              res.writeHead( 200 ).end( JSON.stringify( { error : false, shopcart : shopcartData } ) );                
            }
          }  
          
          // ------------------------------------------------     
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
// Shopcart add
controller.add = async ( req, res, arrPath ) => {
    //
    if(  controllerMethods( req, res, ["POST","PUT"] ) ){
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
            // ------------------------------------------------
            // Token ok and User exist
            
            // Update user token
            tokenUpdate(req);

            // Request body
            req.on( 'data', function(body) {

              if( body ){

                // Body parse
                body = JSON.parse( body );

                // Generate Shopcart uuid
                var id = uuid();

                // Control product add errors
                var blnError = false;

                // Test id creation
                if( !id ){
                    // Generate id Error
                    res.writeHead(404).end( JSON.stringify( { error   : true, message : "Shopcart unique id creation error." } ) );
                    return;
                }

                // Check required parameters
                if( !body.itens.length ){
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "Itens empty / Products needed." } ) );
                  return;
                }

                // Product add container
                const shopcartData = {
                  id,
                  token,
                  itens : []
                }
                // Add Products
                body.itens.map( ( prod ) => {

                  // Product id
                  var id    =   Number(prod.productId);
                  var qtde  =   Number(prod.quantity);

                  // Minimum quantity
                  if( qtde < 1 )  qtde = 1;

                  // Check if product exists
                  if( !PRODUCTS.find( p => p.id == id ) ){
                    // Product not found
                    blnError = true;
                  } else {       
                    // Adding product
                    shopcartData.itens.push({
                              productId   :   id,
                              quantity    :   qtde,
                              addAt       :   Date.now()              
                            });
                  }
                }); // body data
                
                // Check error to add products 
                if( blnError ){
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "Some product added on shopcart doesn't exist." } ) );
                  return;          
                }
   
                if( !fileExists(token, "shopcart") ){
                  // Create shopcart file
                  fileAdd( token, shopcartData, "shopcart", function( err ){
                    // Error creating file
                    if( err ) {
                      res.writeHead(404).end( JSON.stringify( { error   : true, message : "Shopcart file creation error." } ) );  
                      return;
                    }
                  });
                } else {
                  // Shopcart exists

                  // Open shopcart file
                  const shopcartOldData = fileRead(token, "shopcart", function( err ){
                    if( err ) {
                      res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error reading shopcart." } ) );  
                      blnError = true;
                      return;
                    }
                  });

                  // New shopcart data
                  var newShopcart = shopcartOldData;

                  // Add itens
                  shopcartData.itens.forEach( (prod, i) => {
                    // List prod on actual shopcart
                    var prodIdx = newShopcart.itens.map( p => p.productId ).indexOf( prod.productId );
                    // List products to add // If product exist update quantity else add product
                    if( prodIdx > -1 ){
                      // Product exists on shopcart // change quantity
                      newShopcart.itens[prodIdx].quantity  =  prod.quantity;
                      // Add update info
                      newShopcart.itens[prodIdx].updateAt  =   Date.now(); 
                    } else {
                      // New product / add to shopcart
                      newShopcart.itens.push(prod);
                    }
                  });

                  // Update shopcart
                  fileUpdate( token, newShopcart, "shopcart", function( err ) {
                    if( err ) {
                      res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error updating. ["+err+"]" } ) );  
                      blnError = true;
                      return;
                    }
                  });
                }

                if( !blnError ){
                  // Product added
                  res.writeHead(200).end( JSON.stringify( { error : false, message : "Product(s) added(s) to shopcart.", "shopcart" : newShopcart || shopcartData } ) );   
                }
              } else {
                // No data sent
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Product data empty." } ) );  
              }
                    
            });   

            // ------------------------------------------------     
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
// Shopcart delete
controller.delete = async ( req, res, arrPath ) => {
  //
  if(  controllerMethods( req, res, ["DELETE"] ) ){
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
          // ------------------------------------------------
          // Token ok and User exist
            
          // Update user token
          tokenUpdate(req);

          // Request body
          req.on( 'data', function(body) {

            if( body ){

              // Body parse
              body = JSON.parse( body );

              // Generate Shopcart uuid
              var id = uuid();

              // Control product add errors
              var blnError = false;

              // Test id creation
              if( !id ){
                  // Generate id Error
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "Shopcart unique id creation error." } ) );
                  return;
              }

              // Check required parameters
              if( !body.itens.length ){
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Itens empty / Products needed." } ) );
                return;
              }

              // Product add container
              const shopcartData = {
                id,
                token,
                itens : []
              }
 
              if( !fileExists(token, "shopcart") ){
                // Shopcart doesn't exist
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Shopcart doesn't exist." } ) );  
                return;
              } else {
                // Shopcart exists

                // Open shopcart file
                const shopcartOldData = fileRead(token, "shopcart", function( err ){
                  if( err ) {
                    res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error reading shopcart." } ) );  
                    blnError = true;
                    return;
                  }
                });

                // New shopcart data
                var newShopcart = shopcartOldData;

                // Products to be removed
                var shopcartDataDelete = [];
                // Fill products to be removed  
                body.itens.map( ( prod ) => {

                  // Try to remove itens
                  var prodIdx = newShopcart.itens.map( p => p.productId ).indexOf( prod.productId );
                  // List products to remove
                  if( prodIdx > -1 ){
                    // Product exists on shopcart // remove
                    newShopcart.itens.splice(prodIdx,1);
                  }
                }); // body data

                // Update shopcart
                fileUpdate( token, newShopcart, "shopcart", function( err ) {
                  if( err ) {
                    res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error deleting. ["+err+"]" } ) );  
                    blnError = true;
                    return;
                  }
                });
              }

              if( !blnError ){
                // Product added
                res.writeHead(200).end( JSON.stringify( { error : false, message : "Product(s) removed(s) from shopcart.", "shopcart" : newShopcart } ) );   
              }

            } else {
              // No data sent
              res.writeHead(404).end( JSON.stringify( { error   : true, message : "Product data empty." } ) );  
            }
                  
          });   

          // ------------------------------------------------     
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

// Export module
module.exports = controller;