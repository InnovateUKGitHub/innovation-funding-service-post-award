// @ts-check
const cypress = require("cypress");
const { merge } = require("mochawesome-merge");
const marge =require("mochawesome-report-generator");

const config = {
  files: ["cypress/results/*.json"],
};

cypress.run().then(
  () => {
    generateReport(config);
  },
  error => {
    generateReport(config);
    console.error(error);
    process.exit(1);
  },
);

/**
 * 
 * combines the generated json reports into a single json file and then creates an html report from this, and puts it into
 * a `mochawesome-report.html` file
 * @param {typeof config} options 
 * @returns {Promise<void>} create
 */
function generateReport(options) {
  return merge(options).then(report => marge.create(report, options));
}
