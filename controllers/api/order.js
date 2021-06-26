/*
  Order Controller
*/

var { 
    controllerMethods,
    fileRead,
    uuid,
    fileAdd,
    fileExists,
    tokenUpdate
} = require('../../libs/helpers');

// Products list
const { PRODUCTS } = require('./product');

// Container for produts / menu
const controller = {}

// Order view
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

          if( !fileExists(token, "orders") ){
            // Order doesn't exist
            res.writeHead(200).end( JSON.stringify( { error   : false, message : "Order not found." } ) );  
          } else {
            // Order exists // Open order file
            var blnError = false;
            const orderData = fileRead(token, "orders", function( err ){
              blnError = ( err ? true : false );
            });
            if( blnError ) {
              res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error reading order." } ) );  
            } else {
              // Return order
              res.writeHead( 200 ).end( JSON.stringify( { error : false, order : orderData } ) );                
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
// Order add
controller.add = async ( req, res, arrPath ) => {
    //
    if(  controllerMethods( req, res, ["POST"] ) ){
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

            // Generate order uuid
            var id = uuid();

            // Control product add errors
            var blnError = false;

            // Test id creation
            if( !id ){
                // Generate id Error
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Order unique id creation error." } ) );
                return;
            }

            // Read shopcart
            if( !fileExists(token, "shopcart") ){
              // Shopcart doesn't exist
              res.writeHead(200).end( JSON.stringify( { error   : false, message : "Shopcart is empty." } ) );  
            } else {
              // Shopcart exists // Open shopcart file
              var blnError = false;
              // Shopcart data
              let shopcart = fileRead(token, "shopcart", function( err ){
                blnError = ( err ? true : false );
              });  

              if( blnError ){
                // Error reading shopcart file
                res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error reading shopcart." } ) );
              } else {
                // Shopcart ok              

                // Amount order
                let amount =  0;

                // Apply order products
                shopcart.itens.forEach( (prod, i) => {
                  // Product

                  // Product id
                  let id    =   Number(prod.productId);
                  let qtde  =   Number(prod.quantity);

                  // Minimum quantity
                  if( qtde < 1 )  qtde = 1;

                  // Check if product exists
                  if( PRODUCTS.find( p => p.id == id ) ){      
                    // Valid product
                    let prodData  = PRODUCTS.find( (prod) => prod.id == id );
                    let prodPrice = prodData.price;
                    let prodtotal = qtde * prodData.price;

                    // Product value
                    shopcart.itens[i].value    =  prodPrice;
                    // Total ( qtde * value )
                    shopcart.itens[i].total    =  prodtotal;
                    // amount
                    amount += prodtotal;
                  }
                });

                // User data to be placed at order
                const userData = {
                  id        :   userLogged.user.id,
                  name      :   userLogged.user.name,
                  email     :   userLogged.user.email,
                  address   :   userLogged.user.address
                };

                // Remove unliked datas
                delete shopcart.token;

                // Order
                let orderData = {
                  id,
                  token,
                  user : userData,
                  shopcart,
                  amount,
                  createAt : Date.now()
                };

                // Create order file
                // Read order file
                fileAdd( token, orderData, "orders", function( err ){
                  // Error creating file
                  blnError = true;
                });     
                
                if( blnError ) {
                  // Some error occurred
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "Order file creation error." } ) ); 
                } else {
                  // Order placed
                  res.writeHead(200).end( JSON.stringify( { error   : false, message : "Order placed.", order : orderData } ) );                    
                }                  
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

// Export module
module.exports = controller;