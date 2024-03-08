// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands.ts";

// Alternatively you can use CommonJS syntax:

let fileName = "";
let fileHasErrored = false;

/**
 * abort the test run on file, after second test fail in that file
 */
afterEach(function onAfterEach() {
  if (fileName !== this.currentTest.file) {
    fileHasErrored = false;
    fileName = this.currentTest.file;
  }
  if (Cypress.env("ABORT_EARLY") && this.currentTest.state === "failed") {
    if (fileHasErrored) {
      cy.log("stopping this test file because of failure in one test");
      console.error("stopping this test file because of failure in one test");
      // casting as any because Cypress typings do not expose "internal" api
      (Cypress as any).runner.stop();

      fileHasErrored = false;
    } else {
      fileHasErrored = true;
    }
  }
});
