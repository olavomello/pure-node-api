// Libs
var http = require('http');
var url = require('url');
var fs = require('fs');
var config = require('./configs');
var { echo, staticFile } = require('./libs/helpers');
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
        if( arrPath[0] == "api" ){
            // API
            var isApi = true;
            // Endpoint : api
            var endpoint = arrPath[1];      
        } else if( arrPath[0] == "public" ){
            // Public folder      
            var isPublic = true;
            // image,css,js,etc...
            var filePath = arrPath[1];   
            var file     = arrPath[2];              
        } else {
            // HTML
            var isHtml = true;
            // Endpoint : page
            var endpoint = arrPath[0];            
        }

        // Server response
        if ( isApi ){
            // #1 :: Route found
            echo("API > " + endpoint, "alert");
            // Header
            res.setHeader("Content-Type", "application/json");
            // Route
            if( typeof( routes[endpoint] ) == "function" ){
                // Endpoint ok
                routes[endpoint](req, res, arrPath);
            } else {
                // HTML Page not found
                echo("HTML page not found", "error");
                res.writeHead(404);
                res.end();                
            } 
        } else if( isHtml ){
            // #2 :: HTML response
            
            // If no endpoint page go to Index page
            if( !endpoint ) endpoint = "index";

            echo("HTML > " + endpoint, "alert2");
            // Header
            res.setHeader("Content-Type", "text/html");            
            // HTML
            if( typeof( htmlRoutes[endpoint] ) == "function" ){
                // HTML exist
                htmlRoutes[endpoint](req, res, arrPath);
            } else {
                // HTML Page not found
                echo("HTML page not found", "error");
                res.writeHead(404);
                res.end();                
            }            
        } else if( isPublic ) {
            // #4 :: Public files
            
            if( fileContent = staticFile( file, filePath )){
                // Identify file content type
                var arrFileExt = file.split(".");
                var fileExt = String(arrFileExt[1]).toLowerCase();
                // Array mimetypes
                var mimeTypes = {
                    'js': 'text/javascript',
                    'css': 'text/css',
                    'png': 'image/png',
                    'jpg': 'image/jpg',
                    'gif': 'image/gif',
                    'svg': 'image/svg+xml',
                    'wav': 'audio/wav',
                    'mp4': 'video/mp4',
                    'woff': 'application/font-woff',
                    'ttf': 'application/font-ttf',
                    'eot': 'application/vnd.ms-fontobject',
                    'otf': 'application/font-otf'
                };
                var contentType = mimeTypes[fileExt] || 'application/octet-stream';                
                echo("Public file > " + filePath + "/" + file + " > Content-Type : " + contentType, "alert2");
                
                //res.setHeader("Content-Type", contentType);
                res.writeHead(200);
                res.end(fileContent);  
            } else {
                // Static file error
                echo("Public file not found > " + filePath + "/" + file, "error");
                res.writeHead(404);
                res.end();                
            }

            res.writeHead(200);
            res.end();
        } else {
            // #4 :: Route not found
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