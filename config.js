/*
    Configs
*/

var environments = {};

// Staging (default) environment
environments = {
  envName : 'staging',
  mailgun : {
    sender      : 'Mailgun Sandbox <postmaster@sandboxd315fa056beb4922a1c275adef3169e7.mailgun.org>',
    domain      : 'sandboxd315fa056beb4922a1c275adef3169e7.mailgun.org',
    apiKey      : 'api:956842a909cf508f5a0002ce32b88c02-602cc1bf-022de2ac'
  },
  stripe : {
    secretKey   : 'YOUR_STRIPE_SECRET_KEY'
  }
};

module.exports = environments;