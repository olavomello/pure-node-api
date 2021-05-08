/*
  Shopcart Controller
*/

var { 
    controllerMethods,
    userData,
    uuid
} = require('../libs/helpers');

// Products list
const { list } = require('../controllers/product');

// Product list
const _PRODUCTS = list; // TODO - export products

// Container for produts / menu
const shopcart = {}

// Menu
shopcart.add = async ( req, res, arrPath ) => {

    console.log( _PRODUCTS ); 

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

          // Check if product exists
          if( _PRODUCTS.indexOf( id ) == -1 ){
            // Product not found
            res.writeHead(404).end( JSON.stringify( { error   : true, message : "Product doesn't exist." } ) ); 
            return;
          }

          // Adding product
          shopcartData.itens.push({
                    productId   :   id,
                    quantity    :   qtde,
                    addAt       :   Date.now()              
                  });
        }); 
        console.log(shopcartData);  
        
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