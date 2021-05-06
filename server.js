// Libs
var http = require('http');
var url = require('url');
var fs = require('fs');
var config = require('./libs/configs');
var { echo } = require('./libs/helpers');
var routes = require('./libs/routes');

// Consts


// Server
const server = http.createServer( (req, res) => {
    try{
        // Parse URL // ** TODO : Change func 'parse" deprecated
        var urlParse = url.parse(req.url, true);
        // Get path and adjust it
        var path = urlParse.path.toLowerCase().replace(/^\/+|\/+$/g, "");

        // Header
        res.setHeader("Content-Type", "application/json");

        // Server response
        if ( typeof( routes[path] ) == "function" ){
            // Route found
            routes[path](req, res);
        } else {
            // Route not found
            echo("Route not found ["+path+"]","error");
            res.writeHead(404);
            res.end();
        }

    } catch ( err ){
        // Request error
        res.writeHead(404);
        const payload = {
            error   : true,
            status  : "Invalid request"
          }
        res.end( JSON.stringify( payload ) );    
    }
});

// Listen port
server.listen( config.port, ( err ) => {
    // Check server starting error
    if( !err ){
        // Server started successful
        echo("Server running on "+config.env+" mode at port " + config.port + "...", "success");
    } else {
        // Error starting server
        echo("Error starting server on port " + config.port + "...", "error");
    }
});