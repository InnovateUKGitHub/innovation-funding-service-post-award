const pem = require("pem");

/**
 * Create an X509 public/private keypair
 * @returns {Promise<pem.CertificateCreationResult>} A promise to return an X509 keypair.
 */
const makeKeypair = () =>
  new Promise((resolve, reject) => {
    pem.createCertificate(
      {
        days: 5,
        selfSigned: true,
        country: "GB",
        state: "Wiltshire",
        locality: "Swindon",
        organization: "Innovate UK",
        organizationUnit: "Business Systems & Insights",
        commonName: "acc.local-dev",
      },
      (err, keys) => {
        if (err) return reject(err);
        resolve(keys);
      },
    );
  });

module.exports = { makeKeypair };
