const { createRootCA, createCertificate } = require('..');

const ca = createRootCA();
const cert = createCertificate({ ca, hostname: 'test.local' });

console.log(ca);