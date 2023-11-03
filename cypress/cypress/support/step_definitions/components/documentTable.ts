import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the file matches {string} on disk", function (path: string) {
  cy.computeSha256FromDisk(path).should("eq", this.previousFileSha256);
});
