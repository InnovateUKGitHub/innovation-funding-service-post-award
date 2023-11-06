import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the user can see their partner documents", function () {
  cy.getHeading(`Documents for ${this.userInfo.partner.title}`).should("exist");
});

Then("the user can see all documents", function () {
  cy.getHeading(`Documents shared with Innovate UK and Monitoring Officer`).should("exist");
  cy.getHeading(`Documents shared with Innovate UK and partners`).should("exist");
});

Then("the file can be downloaded from the user's partner documents", function () {
  cy.getHeading(`Documents for ${this.userInfo.partner.title}`)
    .nextUntil("h1,h2,h3,h4,h5,h6")
    .get("table")
    .get("a")
    .contains(this.localFileInfo.name)
    .invoke("attr", "href")
    .then(x => {
      cy.downloadFile(x).then(y => {
        this.remoteSha256 = y.sha256;
      });
    });
});

Then("the file is rejected because it is too long", function () {
  cy.getValidationMessage().should(
    "contain.text",
    `You cannot upload '${this.localFileInfo.name}' because the name of the file must be shorter than 80 characters.`,
  );
});

Then("the file is rejected because it has the wrong extension", function () {
  cy.getValidationMessage().should(
    "contain.text",
    `You cannot upload '${this.localFileInfo.name}' because it is the wrong file type.`,
  );
});

Then("the file is rejected because it has forbidden characters", function () {
  cy.getValidationMessage().should(
    "contain.text",
    `Your document '${this.localFileInfo.name}' has failed due to the use of forbidden characters, please rename your document using only alphanumerics and a single dot.`,
  );
});

Then("the file is rejected because it has no name", function () {
  cy.getValidationMessage().should("contain.text", `You cannot upload this file because the file has no name.`);
});
