require("dotenv").config();
import { defineConfig } from "cypress";
import { Tag, tags } from "support/tags";
const fs = require("fs");
/**
 * To target specific deployment branches with ACC number
 *
 * Windows powershell
 * ------------------
 * `$env:ACC=****; npm start`
 *
 * Windows command prompt
 * ----------------------
 * `set ACC=**** && npm start`
 *
 * MAC/Linux
 * ---------
 * `ACC=**** npm start`
 *
 * To run against local host:
 * `npm run local`
 */

const acc = process.env.ACC;
let accDevUrl = `https://www-acc-${(acc ? `custom-${acc}` : "dev").trim()}.apps.ocp4.innovateuk.ukri.org`;

/**
 * Read any `TAGS` or `tags` from process env and ensure that they are valid.
 * tags should be comma separated.
 *
 * @example
 * TAGS=js-disabled,smoke
 */
const grepTags = process.env.TAGS ?? process.env.tags ?? undefined;
if (grepTags) {
  grepTags
    .split(/[ ,]/)
    .filter(x => x)
    .map(x => x.trim())
    .forEach(x => {
      if (!tags.includes(x as Tag)) {
        throw new Error(`"${x}" is not a recognised tag as specified in 'support/tags.ts' `);
      }
    });
}

if (grepTags) {
  console.info("Applying tags", grepTags);
} else {
  console.info("No tags are being applied");
}

/**
 * By default Cypress will run all tests in the e2e folder.
 *
 * Setting env var SPEC_PATTERN with the glob value for matching folder and test file will filter those tests.
 *
 * Do not include .cy.ts at end of file name
 * @example
 * SPEC_PATTERN="5-forecasts/1-forecast-front-page-as-fc"
 * SPEC_PATTERN="5-forecasts/*"
 */
const specPattern = `cypress/e2e/${(process.env.SPEC_PATTERN ?? "**/*").trim()}.cy.ts`;
console.info(`***\ncypress tests configured with specPattern "${specPattern}"\n**\n`);

/**
 * Set global timeout from environment variable
 */
const defaultCommandTimeout: number = parseInt(process.env.TIMEOUT ?? "4000");

/**
 * utility to evaluate if environment variable is true
 */
const isTrue = (s: string = "") => s.toLowerCase() === "true";

/**
 * Set base url from environment variable
 */
const baseUrl = process.env.TEST_URL || accDevUrl;

console.info("*** Targeting url:", baseUrl);

export default defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: false,
    json: true,
  },
  screenshotOnRunFailure: isTrue(process.env.SCREENSHOTS),
  video: isTrue(process.env.VIDEOS),
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      on("task", {
        deleteFile(path) {
          fs.unlinkSync(path);
          console.log(`Deleting file ${path}`);
          return null;
        },
      });
      require("@cypress/grep/src/plugin")(config);
      return config;
    },
    defaultCommandTimeout,
    specPattern: getSpecPatternArray(specPattern),
    excludeSpecPattern: ["cypress/e2e/2-claims/EXCLUDE-large-file-uploads-test.cy.ts"].concat(
      !!grepTags && grepTags.includes("js-disabled") ? [] : ["cypress/e2e/12-js-disabled/**/*.cy.ts"],
    ),
    env: {
      BASIC_AUTH: process.env.BASIC_AUTH,
      ABORT_EARLY: isTrue(process.env.ABORT_EARLY),
      ...(!!grepTags && { grepFilterSpecs: true, grepOmitFiltered: true, grepTags }),
    },
    testIsolation: false,
  },
  retries: { openMode: null, runMode: 1 },
  redirectionLimit: 35,
  experimentalWebKitSupport: true,
});

function getSpecPatternArray(s: string) {
  return s.split(/\s?[ ;,]\s?/).map(x => x.trim());
}
