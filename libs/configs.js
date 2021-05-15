/*
  Configs from API 
*/

// Container for configs
var enviroment = {};

//  Staging
enviroment.staging = {
    port    : 3000,
    env     : 'staging',
    mailgun : {
      host        : 'api.mailgun.net',
      sender      : 'Mailgun Sandbox <postmaster@sandbox95c72a03389049459febada588dac622.mailgun.org>',
      domain      : 'sandbox95c72a03389049459febada588dac622.mailgun.org',
      key         : 'api:b434cd11c2768b4668a26f0d7d77d739-602cc1bf-8c4885b5'
    },
    stripe : {
      key         : 'sk_test_51InChaJgJjjhnXt7lZZLdED4XnQB8bVFUhKhp8EV3yLwq0j5sULouLiPgRoHt6SuANPkflVhjF0OOKiXGmbrkpfT00EWLtqPYd'
    }    
};

// Production
enviroment.production = {
    port    : 3001,
    env     : 'production',
    mailgun : {
      host        : '',
      sender      : '',
      domain      : '',
      key         : ''
    },
    stripe : {
      secretKey   : ''
    }      
};

// Check .env
const environmentName = ( typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' );
const environmentExport =  enviroment[environmentName] || enviroment.staging;

// Exports
module.exports = environmentExport;