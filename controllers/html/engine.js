/*
  Index Page
*/

var { 
    controllerMethods,
    getPage
} = require('../../libs/helpers');

// Container
const controller = {}

// Index
controller.index = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "index";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};

// Signup
controller.signup = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "signup";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};


// Account
controller.account = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "account";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};

// Menu
controller.menu = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "menu";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};

// Login
controller.login = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "login";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};

// Logout
controller.logout = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "logout";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};

// Shopcart
controller.shopcart = async ( req, res, arrPath ) => {
  // 
  if(  controllerMethods( req, res, ["GET"] ) ){
    // Execute HTML page
    const pageName = "shopcart";

    if( page = getPage( pageName ) ){
        // Page ok
        res.writeHead( 200 ).end( page ); 
    } else {
        // Template error
        res.writeHead( 500 ).end( "Error reading " + pageName + " template." );  
    }
  }
};

// Export module
module.exports = controller;