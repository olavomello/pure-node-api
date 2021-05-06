/*
    Functions and helpers
*/

var fs = require('fs');
var path = require('path');

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

// Generate unique id
helpers.uuid = function() {
    // Token size
    const COUNT = 20;
    // String path
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    // Return
    var str  = '';
    // Generate string
    for(var i = 0; i < COUNT; i++)
        str += _sym[parseInt(Math.random() * (_sym.length))];

    return str;
}

// create file
helpers.fileAdd = function( file, data, dir, callback ){
    if( !file && !data && !dir ) {
        // Error
        callback("Error manipulating file. Parameters require empty.");
    } else {
        // Ok
        const fullDir = path.join(__dirname,"../.data/" + dir);

        // Verify directory
        if( !fs.existsSync(fullDir) ){
            // Path dont exist. Try to create 
            try{
                // Path created
                fs.mkdirSync(fullDir);
            } catch( err ){
                // Error creating path
                callback("Error creating path " + fullDir );
            }
        }
        // Create file
        fs.writeFile( fullDir +"/"+ file + ".json", JSON.stringify(data), function(err) {
            if(err) {
                // Error writing file
                callback("Error creating file " + err );
            } else {
                // File writed
                callback(false);
            }
        });         
    }
}


// Export
module.exports = helpers;