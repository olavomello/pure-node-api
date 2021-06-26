// Libs
var http = require('http');
var url = require('url');
var fs = require('fs');
var config = require('./configs');
var { echo } = require('./libs/helpers');
var routes = require('./libs/routes');
var htmlRoutes   = require('./libs/html');

// Server
const server = http.createServer( (req, res) => {
    try{
        // Parse URL // ** TODO : Change func 'parse" deprecated
        var urlParse = url.parse(req.url, true);
        // Get path and adjust it
        var path = urlParse.path.toLowerCase().replace(/^\/+|\/+$/g, "");
        // Find first path
        var arrPath = path.split("/");
        // Switcher ( api | html )
        var isAPI    = ( arrPath[0] == "api" );
        // Endpoint 
        var endpoint = arrPath[1];

        // Server response
        if ( isAPI && typeof( routes[endpoint] ) == "function" ){
            // #1 :: Route found
            echo("API > " + endpoint, "alert");
            // Header
            res.setHeader("Content-Type", "application/json");
            
            // Route
            routes[endpoint](req, res, arrPath);
        } else if( !isAPI ){
            // #2 :: HTML response

            // Index page
            if( !endpoint ) endpoint = "index";
            echo("HTML > " + endpoint, "alert2");
            // Header
            res.setHeader("Content-Type", "text/html");            
            
            // HTML
            if( htmlRoutes[endpoint] == "function" ){
                // HTML exist
                htmlRoutes[endpoint](req, res, arrPath);
            } else {
                // HTML Page not found
                echo("HTML page not found", "error");
                res.writeHead(404);
                res.end();                
            }            
        } else {
            // #3 :: Route not found
            echo("Invalid endpoint > " + endpoint, "error");
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