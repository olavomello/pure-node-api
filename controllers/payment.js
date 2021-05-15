/*
  Payment Controller
*/

var { 
    controllerMethods,
    fileRead,
    uuid,
    fileAdd,
    fileExists,
    tokenUpdate,
    payGo,
    sendmail
} = require('../libs/helpers');


// Container for produts / menu
const controller = {}

// Payment view
controller.pay = async ( req, res, arrPath ) => {
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
            // Shopcart exists // Open shopcart file
            var blnError = false;
            const orderData = fileRead(token, "orders", function( err ){
              blnError = ( err ? true : false );
            });
            if( blnError ) {
              res.writeHead(404).end( JSON.stringify( { error   : true, message : "Error reading order." } ) );  
            } else {
              // Everthing ok - go to payment
              // res.writeHead( 200 ).end( JSON.stringify( { error : false, pay : true } ) );     
              // --------------------------------------------
              
              // Payment Payload
              var paymentData = {
                amount      :  orderData.amount,
                currency    : "usd",
                source      : "tok_mastercard",
                description : "Order id : " + orderData.id
              };

              // Start payment
              payGo( paymentData, function(err){

                if( !err ){

                    // Email subject
                    var emailSubject = 'Order placed';
                    // Email body
                    var emailBody    = "Order ID : " + orderData.id + "\n Product(s): \n" + orderData.shopcart.itens + " \n Total: US$" + orderData.amout + "\n Thank you so much !";

                    // Send order by email userName, userEmail, subject, message, callback
                    sendmail( orderData.user.name, orderData.user.email, emailSubject ,emailBody,function(err){
                        if ( !err ) {

                            userData.paid = true;

                            _data.update('cart',orderId,userData,function(err){

                                if (!err){
                                    callback(200, {'Message': 'Order placed successfully!'});
                                } else {
                                    callback(500, {'Error' : 'could not update cart file to paid status'}); 
                                }
                            });
                            
                        } else {
                          // Sendmail error
                          res.writeHead(500).end( JSON.stringify( { error   : true, message : "Sendmail error.", err } ) );
                        }
                    });

                } else {
                  // Payment error
                  res.writeHead(500).end( JSON.stringify( { error   : true, message : "Payment error :", err } ) ); 
                }
              });                 

              // --------------------------------------------          
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