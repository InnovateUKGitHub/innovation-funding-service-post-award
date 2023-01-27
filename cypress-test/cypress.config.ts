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

const accNumber = (process.env.ACC ?? "").trim();
let accDevUrl = `https://www-acc-dev${accNumber}.apps.ocp4.innovateuk.ukri.org`;

/**
 * By default Cypress will run all tests in the e2e folder.
 *
 * Setting env var SPEC_PATTERN with the glob value for matching folder and test file will filter those tests
 * do not include .cy.ts at end of file name
 * @example
 * SPEC_PATTERN="5-forecasts/1-forecast-front-page-as-fc"
 * SPEC_PATTERN="5-forecasts/*"
 */
const overridePattern: string = undefined;
const specPatternGlob = (process.env.SPEC_PATTERN ?? overridePattern ?? "**/*").trim();
let specPattern = `cypress/e2e/${specPatternGlob}.cy.ts`;
console.log(`cypress tests configured with spec_pattern ${specPattern}`);

export default defineConfig({
  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/results/test-output.xml",
    toConsole: true,
  },
  e2e: {
    baseUrl: process.env.TEST_URL || accDevUrl,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    specPattern,
    env: {
      BASIC_AUTH: process.env.BASIC_AUTH,
    },
    testIsolation: false,
  },
});
