#!/usr/bin/env node

const { writeFileSync } = require('fs');
const { createRootCA, createCertificate } = require('..');

const [hostname] = process.argv.slice(2);

(() => {
  const ca = createRootCA();
  const cert = createCertificate({ ca, hostname });
  writeFileSync(`./${hostname}.cert`, cert.cert);
  writeFileSync(`./${hostname}.key`, cert.key);
})();