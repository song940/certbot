#!/usr/bin/env node

const { writeFileSync } = require('fs');
const { createRootCA, createCertificate } = require('..');

const [hostname = 'certman.local'] = process.argv.slice(2);

(() => {
  const cert = createCertificate({ hostname });
  writeFileSync(`./${hostname}.cert`, cert.cert);
  writeFileSync(`./${hostname}.key`, cert.key);
})();