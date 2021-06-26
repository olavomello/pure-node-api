/*
  Payment Controller
*/

var { 
    controllerMethods,
    fileRead,
    fileAdd,
    fileExists,
    tokenUpdate,
    payGo,
    sendmail,
    echo
} = require('../../libs/helpers');


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
                    let emailSubject  = 'Order placed';
                    // Email body
                    let emailBody     = "Order ID : " + orderData.id + "\nTotal: US$" + orderData.amount + "\nThank you so much !";

                    // Controll email sent
                    var blnEmailSent  = false;

                    // Send order by email userName, userEmail, subject, message, callback
                    sendmail( orderData.user.name, orderData.user.email, emailSubject , emailBody, function(err){
      
                        if ( !err ) {
                          blnEmailSent = true;
                        } else {
                          // Sendmail error
                          echo("Error sending email ordering to user ["+token+"]", "error");
                          res.writeHead(500).end( JSON.stringify( { error : true, message : "Order finished but email doesn't send to user.", err } ) );
                        }

                        // Register payment 
                        const paymentLog = {
                          paymentData,
                          orderData,
                          paid : true,
                          emailSent : blnEmailSent,
                          createAt: Date.now()
                        };

                        // Save payment log   
                        fileAdd(token,paymentLog,"payments", function(err){
                          if( err ){
                            // Error registering payment
                            echo("Error logging payment ["+token+"]", "error");
                          }
                        });                    

                        // Finish payment
                        res.writeHead(200).end( JSON.stringify( { error : false, message : "Order finished successfully !", log : paymentLog } ) );                        
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