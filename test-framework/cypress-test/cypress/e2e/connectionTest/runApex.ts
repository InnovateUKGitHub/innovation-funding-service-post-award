import { When } from "@badeball/cypress-cucumber-preprocessor";

When("Cypress tries to run Apex", function () {
  cy.accTask("runApex", { apex: "System.debug('Hello World');" }).then(x => {
    cy.log(JSON.stringify(x));
  });
});
