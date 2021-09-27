const http = require('http');
const https = require('https');
const kelp = require('kelp');
const send = require('kelp-send');
const body = require('kelp-body');
const logger = require('kelp-logger');
const Router = require('kelp-router');

const { createRootCA, createCertificate } = require('./certbot');

const app = kelp();

const router = new Router();

app.use(send);
app.use(body);
app.use(logger);
app.use(router);

router.get('/', (req, res) => {
  res.send('hello world!');
});

router.post('/create-ca', (req, res) => {
  const {
    commonName, countryName, ST,
    localityName, organizationName, OU
  } = req.body;
  const subject = [];

  if (commonName) subject.push({
    name: 'commonName',
    value: commonName
  });


  if (countryName) subject.push({
    name: 'countryName',
    value: countryName
  });

  if (ST) subject.push({
    shortName: 'ST',
    value: ST
  });

  if (localityName) subject.push({
    name: 'localityName',
    value: localityName
  });

  if (organizationName) subject.push({
    name: 'organizationName',
    value: organizationName
  });

  if (OU) subject.push({
    shortName: 'OU',
    value: OU
  });

  const ca = createRootCA({ subject });
});

http.createServer(app).listen(3000);