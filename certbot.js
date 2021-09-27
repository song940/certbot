const { pki, md } = require('node-tls');

const { sha256 } = md;

const issuer = [{
  name: 'commonName',
  value: 'example.org'
}, {
  name: 'countryName',
  value: 'US'
}, {
  shortName: 'ST',
  value: 'Virginia'
}, {
  name: 'localityName',
  value: 'Blacksburg'
}, {
  name: 'organizationName',
  value: 'Test'
}, {
  shortName: 'OU',
  value: 'Test'
}];

const getDate = (days = 0) => {
  const date = new Date;
  const t = date.getDate();
  date.setDate(t + days);
  return date;
};

const createKeypair = (length = 2048) => {
  return pki.rsa.generateKeyPair(length);
};

/**
 * createCert
 */
function createCert({ publicKey, subject = issuer, extensions = [], days = 365 }) {
  const cert = pki.createCertificate();
  cert.validity.notBefore = getDate();
  cert.validity.notAfter = getDate(days);
  cert.publicKey = publicKey;
  cert.setIssuer(issuer);
  cert.setSubject(subject);
  cert.setExtensions(extensions);
  return cert;
}

/**
 * createRootCA
 * @param {*} param0 
 * @returns 
 */
function createRootCA({ subject = issuer, ...options } = {}) {
  const { publicKey, privateKey } = createKeypair();
  const cert = createCert({
    publicKey,
    subject,
    extensions: [
      {
        name: 'basicConstraints',
        cA: true
      }
    ],
    ...options,
  });
  cert.sign(privateKey, sha256.create());
  return {
    cert,
    publicKey,
    privateKey,
    key: privateKey,
  };
};

/**
 * createCertificate
 * @param {*} param0 
 * @returns 
 */
const createCertificate = ({ hostname, ca, ...options }) => {
  const { key: rootKey, cert: rootCert } = ca;
  const publicKey = pki.setRsaPublicKey(rootKey.n, rootKey.e);
  const cert = createCert({
    publicKey,
    subject: [{
      name: 'commonName',
      value: hostname,
    }],
    extensions: [
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 2,
            value: hostname
          }
        ]
      }
    ],
    ...options,
  });
  const { attributes: issuer } = rootCert.subject;
  cert.setIssuer(issuer);
  cert.sign(rootKey, sha256.create());
  return {
    cert: pki.certificateToPem(cert),
    key: pki.privateKeyToPem(rootKey),
  };
};

// pki.privateKeyToPem(privateKey),
// pki.publicKeyFromPem(publicKey),
// pki.certificateToPem(cert),

// pki.privateKeyFromPem(privateKey);
// pki.publicKeyFromPem(publicKey);
// pki.certificateFromPem(cert);

module.exports = {
  createCert,
  createRootCA,
  createCertificate,
};