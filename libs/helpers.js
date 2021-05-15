/*
    Functions and helpers
*/

var config = require('./../libs/configs');
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
// API method checker
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
    // Read file
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
// Update user token expiration
helpers.tokenUpdate = async function( req ) {

    // Read Request
    try{

      // User token
      var token = ( req.headers.token ? String(req.headers.token).trim() : "");
      // Token validation
      token     = ( token && token != "undefined" ? token : false );
          
    } catch( err ) {
      // No request
      // console.log("updateToken error");
      return;
    }
  
    // Check required parameters
    if( !token ) {
      // Token not passed
      // console.log("Token not passed");
      return false;
    } else if( !( userLogged = helpers.tokenData(token) ) ) {
      // Token not found
      // console.log("Token not found");
      return false;        
    }
    // Check token expiration
    if( userLogged.expire < Date.now()) {
      // Token expired
      // console.log("Token expired");
      return false;         
    }   
    // Check user id
    if( !userLogged.user.id ) {
      // User id not found
      // console.log("User id not found");
      return false;           
    }        
    // Tolen update date-time
    const tokenExpire = ( Date.now() + ( 60*60*1000 ) ); // 60 minutes ahead
    
    // Get token data
    let userTokenData = helpers.fileRead(token, "tokens", function( err ){});
    //console.log("userTokenData.expire before:",userTokenData.expire);
    
    // Update token expire
    userTokenData.expire = tokenExpire;
    //console.log("userTokenData.expire after:",userTokenData.expire);

    // Update token file
    helpers.fileUpdate( token, userTokenData, "tokens", function( err ){});
};
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
          if( hasCallback ) callback(name + ' > api status error : ' + status);
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

    // Check required parameters
    if( !userName || !userEmail || !subject || !message ){
        // Error
        callback("Parameters required");
    } else {
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
        'auth'     :  config.mailgun.key,
        'path'     :  '/v3/' + config.mailgun.domain + '/messages',
        'headers'  :  {
                        'Content-Type'      : 'application/x-www-form-urlencoded',
                        'Content-Length'    : Buffer.byteLength(querystring.stringify(payload))
                      }
        };
    
        // API Request
        apiRequester("Mailgun", request, payload, (err) => callback(err) );
    }
};
// Payment Go ( Stripe and others in the future )
helpers.payGo = function( paymentData, callback){

    // Check required parameters
    // PaymentData : amount, currency, description, source
    if( !paymentData.amount || !paymentData.description || ! paymentData.source){
        // Error 
        callback("Parameter required");
    } else {
        // Payload
        var payload = {
            'amount'        :   paymentData.amount,
            'currency'      :   ( paymentData.currency || "usd" ),
            'description'   :   paymentData.description,
            'source'        :   paymentData.source,
        };

        // Request
        var request = {
        'protocol'        : 'https:',
        'hostname'        : 'api.stripe.com',
        'method'          : 'POST',
        'auth'            : config.stripe.key,
        'path'            : '/v1/charges',
        'headers'         : {
                'Content-Type'  : 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(querystring.stringify(payload))
            }
        };  
    
        // API Request
        apiRequester("Stripe", request, payload, (err) => callback(err) );
    }
};

// Export
module.exports = helpers;