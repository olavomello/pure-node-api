<h1>PURE SHOPCART API NODE.JS</h1>
<h3>Only using native NodeJs libs ;)</h3>

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

```Yaml
<h5>API usage test</h5>
<p>Use YAML file to test on Insominia using : <b>Insomnia.yaml</b></p>
```