require("dotenv").config();
import { defineConfig } from "cypress";

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
let accDevUrl = `https://www-acc-dev${(process.env.ACC ?? "").trim()}.apps.ocp4.innovateuk.ukri.org`;

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
const defaultCommandTimeout: number = parseInt(process.env.TIMEOUT) ?? 4000;

const isTrue = (s: string = "") => s.toLowerCase() === "true";

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
    baseUrl: process.env.TEST_URL || accDevUrl,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    defaultCommandTimeout,
    specPattern: getSpecPatternArray(specPattern),
    env: {
      BASIC_AUTH: process.env.BASIC_AUTH,
    },
    testIsolation: false,
  },
  retries: 1,
});

function getSpecPatternArray(s: string) {
  return s.split(/\s?[ ;,]\s?/).map(x => x.trim());
}
