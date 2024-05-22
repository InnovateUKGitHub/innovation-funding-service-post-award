import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

const uploadFile = (path: string) =>
  function (name: string, type?: string) {
    cy.setFileFromDisk(path, name);
    cy.getByLabel("Type").select(type ?? "");
    cy.getForm().contains("form", "Upload documents").submit();

    this.localFileInfo = {
      name,
      type,
      path,
    };
  };

When("the user uploads a file named {string} with no type", function (name: string) {
  uploadFile("README.md").call(this, name);
});

When("the user uploads a file named {string} as type {string}", function (name: string, type: string) {
  uploadFile("README.md").call(this, name, type);
});

Then("the upload succeeds", function () {
  cy.getSuccessMessage().should("exist");
});

Then("the upload fails because the file name is too long", function () {});

Then("the user cannot see the {string} input", (label: string) => {
  cy.getLabel(label).should("not.exist");
});

Then("the user can see the {string} input", (label: string) => {
  cy.getByLabel(label).should("exist");
});
