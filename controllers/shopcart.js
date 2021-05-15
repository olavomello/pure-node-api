/*
  Shopcart Controller
*/

var { 
    controllerMethods,
    userData,
    uuid,
    fileAdd
} = require('../libs/helpers');

// Products list
const { PRODUCTS } = require('../controllers/product');

// Container for produts / menu
const shopcart = {}

// Menu
shopcart.add = async ( req, res, arrPath ) => {

    console.log( PRODUCTS ); 

    //
    if(  controllerMethods( req, res, ["POST"] ) ){
      // Execute payload return
  
      // User token
      var token = String(req.headers.token).trim();
      // Token validation
      token     = ( token && token != "undefined" ? token : false );
  
      if( token ){
        // Token exist
        if( userLogged = userData(token) ){
    
          // Check token expiration
          if( userLogged.expire < Date.now()) {
            // Token expired
            res.writeHead( 404 ).end( JSON.stringify( { error : false, message : "Token expired. Please do login again."} ) );            
          } else {
            // ------------------------------------------------
            // Token ok and User exist
            
            // Request body
            req.on( 'data', function(body) {

              if( body ){

                // Body parse
                body = JSON.parse( body );

                // Generate Shopcart uuid
                var id = uuid();

                // Control product add errors
                var bln_error = false;

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
                  itens : []
                }
                // Add Products
                body.itens.map( ( prod ) => {

                  // Product id
                  var id    =   Number(prod.productId);
                  var qtde  =   Number(prod.quantity);

                  // Minimum quantity
                  if( qtde < 1 )  qtde = 1;

                  console.log("PRODUCTS:", PRODUCTS);

                  // Check if product exists
                  if( !PRODUCTS.find( p => p.id === id ) ){
                    // Product not found
                    bln_error = true;
                  } else           
                    // Adding product
                    shopcartData.itens.push({
                              productId   :   id,
                              quantity    :   qtde,
                              addAt       :   Date.now()              
                            });{
                  }
                }); // body data
                
                // Check error to add products 
                if( bln_error ){
                  res.writeHead(404).end( JSON.stringify( { error   : true, message : "Some product added on shopcart doesn't exist." } ) );
                  return;          
                }
   
                // Create file
                fileAdd( id, shopcartData, "shopcart", function( err ){
                  // Error creating file
                  if( err ) {
                    res.writeHead(404).end( JSON.stringify( { error   : true, message : "Shopcart file creation error." } ) );  
                    return;
                  }
                });

                // Product added
                res.writeHead(200).end( JSON.stringify( { error : false, message : "Product added to shopcart.", shopcartData } ) );   

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
module.exports = shopcart;