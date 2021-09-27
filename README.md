## certman

### Install

```
~$ npm i certman --save
```

### CLI Usage

```sh
~$ npm i -g certman
~$ cerman myhostname.local
```

### Example

```js

const { 
  createRootCA, 
  createCertificate,
} = require('certman');
const https = require('https');

const ca = createRootCA();
const cert = createCertificate({ ca, hostname: 'test.local' });

https.createServer({
  key: cert.key,
  cert: cert.cert,
}, (req, res) => {
    res.end('hello world');
}).listen(6443);
```


### License

This project is under MIT license.