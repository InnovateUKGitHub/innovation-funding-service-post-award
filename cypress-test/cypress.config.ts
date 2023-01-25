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

const accNumber = (process.env.ACC || "").trim();
let accDevUrl = `https://www-acc-dev${accNumber}.apps.ocp4.innovateuk.ukri.org`;
export default defineConfig({
  e2e: {
    baseUrl: process.env.TEST_URL || accDevUrl,
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    env: {
      BASIC_AUTH: process.env.BASIC_AUTH,
    },
    testIsolation: false,
  },
});
