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

// File creation
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

        // Check if file exists
        if( !helpers.fileExists( file, "users") ){
            // Create file
            fs.writeFile( fullDir +"/"+ file + ".json", JSON.stringify(data), function(err) {
                if(err) {
                    // Error writing file
                    callback("Error creating file " + err );
                } else {
                    // File written
                    callback(false);
                }
            });         
        } else {
            // File exist
            callback("Error creating file. User file exists");
        }
    }
}

// File check if exists
helpers.fileExists = function( file, dir ){
    
    // Path
    const fullDir = path.join(__dirname,"../.data/" + dir);
    // File
    const fullFile =  fullDir +"/"+ file + ".json";
    // Check if exists
    return ( fs.existsSync(fullFile) ? true : false );
}

// List files and check if email exists
helpers.userExists = function( userEmail ){
    // Control
    var userExist = false;
    // Path
    const fullDir = path.join(__dirname,"../.data/users");
    // List files
    fs.readdirSync(fullDir).forEach(file => {
        // Read user file
        try{
            var { email } = JSON.parse(fs.readFileSync(fullDir +"/"+ file));
            if( userEmail == email ) { 
                // Confirm that user exist
                userExist = true;
                // Stop files checking
                return;
            }
        } catch( err ){}
    });

    // Users doesn't exist
    return userExist;
}

// Read user file
helpers.userData = function( token ){
    // Path
    const fullDir = path.join(__dirname,"../.data/users");
    // File
    const fullFile =  fullDir +"/"+ token + ".json";

    if( fs.existsSync(fullFile) ){
        // User file found
        return JSON.parse( fs.readFileSync(fullFile) );
    } else {
        // File not found
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
    var id  = '';
    // Generate string
    for(var i = 0; i < COUNT; i++)
    id += _sym[parseInt(Math.random() * (_sym.length))];

    // Check if uuid exists // Recursive check if ID was used
    if( helpers.fileExists(id,"users") )        helpers.uuid();
    else                                        return id;
}



// Export
module.exports = helpers;