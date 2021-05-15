<h1>PURE SHOPCART API NODE.JS</h1>
<h3>Only using NodeJs native libs ;)</h3>

<div align="center" style="text-align:center;">
    <img src="https://img.shields.io/github/issues/olavomello/pure-node-api?style=flat"/> <img src="https://img.shields.io/github/stars/olavomello/pure-node-api?style=flat"/> <img src="https://img.shields.io/github/issues/olavomello/pure-node-api?style=flat"/> 
</div>

<h4>Firstly, set configs.js file on basepath:</h4>

```Javascript
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
```

<h2>API usage test</h2>
<p>Use YAML file to test on Insominia using : <b><a target="_blank" href="https://github.com/olavomello/pure-node-api/blob/master/Insomnia.yaml">Insomnia.yaml</a></b></p>