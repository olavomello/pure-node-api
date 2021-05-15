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
      sender      : 'Mailgun Sandbox <postmaster@sandboxc625ea4d75e34a6aa93c844bd5493a76.mailgun.org>',
      domain      : 'sandboxc625ea4d75e34a6aa93c844bd5493a76.mailgun.org',
      key         : '6b19a2de44b707bd199436597a6b0853-602cc1bf-309ae6ae'
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