const http = require('http');
const https = require('https');
const kelp = require('kelp');
const send = require('kelp-send');
const body = require('kelp-body');
const logger = require('kelp-logger');
const Router = require('kelp-router');

const { createRootCA, createCertificate } = require('./certbot');

const ca = createRootCA();
const cert = createCertificate({ ca, hostname: 'certman.lsong.org' });

const app = kelp();

const router = new Router();

app.use(send);
app.use(body);
app.use(logger);
app.use(router);

router.get('/', (req, res) => {
    res.send('hello world!');
});

http.createServer(app).listen(3000);
https.createServer({
    key: cert.key,
    cert: cert.cert,
}, app).listen(6443);