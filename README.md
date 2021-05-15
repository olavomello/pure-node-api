## PURE SHOPCART NODE.JS

// Set Configs
<code>
// Container for configs
var enviroment = {};

//  Staging
enviroment.staging = {
    port    :  3000,
    env     : 'staging',
    mailgun : {
      host        : 'api.mailgun.net',
      sender      : '',
      domain      : '',
      key         : ''
    },
    stripe : {
      key         : ''
    }    
};

// Check .env
const environmentName = ( typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' );
const environmentExport =  enviroment[environmentName] || enviroment.staging;

// Exports
module.exports = environmentExport;
</code>
