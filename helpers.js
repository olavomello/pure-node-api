/*
    Functions and helpers
*/

// Container for helpers
const helpers = {}; 

// Console printer
helpers.echo = function( msg = "", status = "normal" ) {
    // Select color to console message
    switch( status ){
        case "normal" :
        default:            
            var color = 7;
            var bg = 0;
            break;
        case "success" :
            var color = 0;
            var bg = 2;
            break;            
        case "alert" :
            var color = 0;
            var bg = 3;
            break;
        case "error" :
            var color = 7;
            var bg = 1;
            break;                            
    }
    if( bg )
        console.log("\x1b[4"+bg+"m\x1b[3"+color+"m%s\x1b[0m",msg);
    else 
        console.log("\x1b[3"+color+"m%s\x1b[0m",msg);
}

// api method check
helpers.controllerMethods = function( req, res, acceptableMethods = ['GET','POST','PUT','DELETE'] ){
    // Request method
    const method = String(req.method).toUpperCase();
    
    if( acceptableMethods.indexOf( method ) > -1 ){
        // Method accepted
        return true;
    } else {
        // Invalid method // Request error
        res.writeHead(404);
        const payload = {
            error   : true,
            status  : "Invalid method"
          }
        res.end( JSON.stringify( payload ) );    

        return false;
    }    
}

// Export
module.exports = helpers;