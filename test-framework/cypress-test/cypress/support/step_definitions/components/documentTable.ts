import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the file matches what was uploaded", function () {
  cy.computeSha256FromDisk(this.localFileInfo.path).should("eq", this.remoteSha256);
});
