import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user can see their partner documents", function () {
  cy.getHeading(`Documents for ${this.userInfo.partner.title}`).should("exist");
});

Then("the user can see all documents", function () {
  cy.getHeading(`Documents shared with Innovate UK and Monitoring Officer`).should("exist");
  cy.getHeading(`Documents shared with Innovate UK and partners`).should("exist");
});

Then("the file {string} can be downloaded from the user's partner documents", function (name: string) {
  cy.getHeading(`Documents for ${this.userInfo.partner.title}`)
    .nextUntil("h1,h2,h3,h4,h5,h6")
    .get("table")
    .get("a")
    .contains(name)
    .invoke("attr", "href")
    .then(x => {
      cy.downloadFile(x).then(y => {
        this.previousFileSha256 = y.sha256;
      });
    });
});
