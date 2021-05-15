/*
    Functions and helpers
*/

var config = require('./../config');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var https = require('https');

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

// Read file
helpers.fileRead = function( id, dir ){
    // Path
    const fullDir = path.join(__dirname,"../.data/" + dir);
    // File
    const fullFile =  fullDir +"/"+ id + ".json";

    if( fs.existsSync(fullFile) ){
        // User file found
        return JSON.parse( fs.readFileSync(fullFile) );
    } else {
        // File not found
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
            callback("Error, file exists.");
        }
    }
}
// File update
helpers.fileUpdate = function( file, data, dir, callback ){
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
        if( helpers.fileExists( file, dir) ){
            // Update file
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
            callback("Error, file not found.");
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

// List files and check if email exists
helpers.userDataByEmail = function( userEmail, exceptId = false ){
    // Control
    var userExist = false;
    // Path
    const fullDir = path.join(__dirname,"../.data/users");
    // List files
    fs.readdirSync(fullDir).forEach(file => {
        // Read user file
        try{
            var user = JSON.parse(fs.readFileSync(fullDir +"/"+ file));
            // Check email and if exceptId = true ignore user with same id
            if( userEmail == user.email && ( !exceptId || ( exceptId && exceptId != user.id ) ) ) { 
                // Confirm that user exist
                userExist = user;
                // Stop files checking
                return;
            }
        } catch( err ){}
    });

    // Users doesn't exist
    return userExist;
}

// Delete user file
helpers.fileDelete = function( token, dir ){
    // Path
    const fullDir = path.join(__dirname,"../.data/" + dir);
    // File
    const fullFile =  fullDir +"/"+ token + ".json";

    if( fs.existsSync(fullFile) ){
        // User file found
        fs.unlink(fullFile, function( ret ){});
        return true;
    } else {
        // File not found
        return false;
    }
}
// List all token files from user 
helpers.listUserToken = function( userId ){
    // Control
    var arrFiles = [];
    // Path
    const fullDir = path.join(__dirname,"../.data/tokens");
    // List files
    fs.readdirSync(fullDir).forEach(file => {
        // Read user file
        try{
            var userLogged = JSON.parse(fs.readFileSync(fullDir +"/"+ file));
            if( userId == userLogged.user.id ) { 
                // User match
                arrFiles.push(userLogged.token);
            }
        } catch( err ){
            return false;
        }
    });

    // Return token array list
    return arrFiles;
}

// Read login token
helpers.tokenData = function( token ){
    // Path
    const fullDir = path.join(__dirname,"../.data/tokens");
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

// API custom request | internal use
function apiRequester( name, request, payload, callback, debug ){
    
    // Debug
    if( debug ) console.log("Debugging : " + name, request, payload);

    // Callback check
    const hasCallback = (callback && typeof callback === 'function');

    // API Request
    var req = https.request(request, function(res){
        // Status from request
        var status = res.statusCode;
        // Callback successfully if the request went through
        if( status == 200 || status == 201 ){
          if( hasCallback ) callback(false);
        } else {
          // Error 
          if( hasCallback ) callback(name + '> api status error : ' + status);
        }
    });
    
    // Bind api errors
    req.on('error',function(e){
        if( hasCallback ) callback(name + '> Error :' + e);
    });
    // Execute and finish
    req.write( querystring.stringify(payload) )
    req.end();    
}

// Sendmail // Mailgun
helpers.sendmail = function( userName, userEmail, subject, message, callback ){

    // Payload
    var payload = {
        'from'    :   config.mailgun.sender,
        'to'      :   userName + '<'+ userEmail +'>',
        'subject' :   subject,
        'text'    :   message
    };    

    // Configure the request
    var request = {
      'protocol' :  'https:',
      'hostname' :  config.mailgun.host,
      'method'   :  'POST',
      'auth'     :  'api:' + config.mailgun.key,
      'path'     :  '/v3/' + config.mailgun.domain + '/messages',
      'headers'  :  {
        'Content-Type'      : 'application/x-www-form-urlencoded',
        'Content-Length'    : Buffer.byteLength(querystring.stringify(payload))
      }
    };
  
    // API Request
    apiRequester("Mailgun", request, payload, (err) => { if( err ) console.error( err ); });
};

// Payment // Stripe
helpers.stripe = function( amount, currency, description, source, callback){

    // Payload
    var payload = {
        'amount'        :   amount,
        'currency'      :   currency,
        'description'   :   description,
        'source'        :   source,
    };

    // Request
    var request = {
      'protocol'        : 'https:',
      'hostname'        : 'api.stripe.com',
      'method'          : 'POST',
      'auth'            : config.stripe.secretKey,
      'path'            : '/v1/charges',
      'headers'         : {
            'Content-Type'  : 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(querystring.stringify(payload))
        }
    };  
  
    // API Request
    apiRequester("Stripe", request, payload, (err) => { if( err ) console.error( err ); });
};


// Export
module.exports = helpers;