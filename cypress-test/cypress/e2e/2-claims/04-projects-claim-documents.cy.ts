import { visitApp } from "../../common/visit";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { selectFileDescription, shouldShowProjectTitle } from "./steps";
import { Intercepts } from "common/intercepts";

const pmEmail = "james.black@euimeabs.test";

describe("claims > documents upload screen", () => {
  before(() => {
    cy.intercept("POST", "/api/documents/claim-details/*").as("uploadDocument");
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1/documents" });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to costs to be claimed");
  });

  it("Should still display the project title", shouldShowProjectTitle);

  it("Should have an upload heading", () => {
    cy.get("h2").contains("Upload");
  });

  it("Should test the file components", () => {
    cy.testFileComponent(
      "James Black",
      "costs to be claimed",
      "Costs to be claimed",
      "Continue to claims documents",
      Intercepts.claims,
      true,
      false,
      false,
    );
  });

  it("Should have a description dropdown to describe the file you are uploading", selectFileDescription);

  it("Should save and return to claims", () => {
    cy.wait(500);
    cy.get("a.govuk-button--secondary").click();
    cy.heading("Claims");
  });
});
