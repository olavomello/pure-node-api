/*
    Configs
*/

var environments = {};

// Staging (default) environment
environments = {
  envName : 'staging',
  mailgun : {
    host        : 'api.mailgun.net',
    sender      : 'Mailgun Sandbox <postmaster@sandboxc625ea4d75e34a6aa93c844bd5493a76.mailgun.org>',
    domain      : 'sandboxc625ea4d75e34a6aa93c844bd5493a76.mailgun.org',
    key         : '6b19a2de44b707bd199436597a6b0853-602cc1bf-309ae6ae'
  },
  stripe : {
    secretKey   : 'YOUR_STRIPE_SECRET_KEY'
  }
};

module.exports = environments;