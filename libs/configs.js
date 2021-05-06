/*
  Configs from API 
*/

// Container for configs
var enviroment = {};

//  Staging
enviroment.staging = {
    'port' : 3000,
    'env'  : 'staging'
};

// Production
enviroment.production = {
    'port' : 3001,
    'env'  : 'production'
};

// Check .env
const environmentName = ( typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' );
const environmentExport =  enviroment[environmentName] || enviroment.staging;

// Exports
module.exports = environmentExport;