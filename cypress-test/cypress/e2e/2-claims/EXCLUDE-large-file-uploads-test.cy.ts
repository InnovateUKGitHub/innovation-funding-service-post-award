import { visitApp } from "common/visit";
import { seconds } from "common/seconds";
const fc = "wed.addams@test.test.co.uk";
const mo = "testman2@testing.com";

/**
 * This test is too long to run as part of the normal Cypress suite but is useful when run manually.
 * We use 'excludeSpecPattern' within cypress.config.ts to exclude, while keeping it in our repo.
 * When required, we can manually launch it by overriding the excludeSpecPattern.
 */

describe("claims > Upload 300 files and ensure submission works", () => {
  before(() => {
    visitApp({ asUser: fc, path: "projects/a0E2600000pMzYvEAK/overview" });
  });

  it("Should access the Claims tile and the claim", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.get("td").contains("Edit").click();
    cy.heading("Costs to be claimed");
  });

  it("Should navigate to docs page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should upload an IAR", () => {
    cy.fileInput("testfile.doc");
    cy.get("#description").select("Independent accountant’s report");
    cy.clickOn("Upload documents");
    cy.validationNotification("has been uploaded");
  });
  it("Should upload 300 documents", () => {
    const docList = [
      "testfile.doc",
      "testfile2.doc",
      "testfile3.doc",
      "testfile4.doc",
      "testfile5.doc",
      "testfile6.doc",
      "testfile7.doc",
      "testfile8.doc",
      "testfile9.doc",
      "testfile10.doc",
    ];
    const documentPaths = docList.map(doc => `cypress/documents/${doc}`);
    for (let i = 0; i < 30; i++) {
      cy.log("Uploading batch number " + i.toString());
      cy.intercept("POST", `/api/documents/claimDocuments/**`).as("filesUpload");
      cy.get(`input[type="file"]`)
        .wait(300)
        .selectFile(documentPaths, { force: true, timeout: seconds(5) });
      cy.clickOn("Upload documents");
      cy.wait("@filesUpload");
      cy.wait(1000);
      cy.get(`[data-qa="validation-message-content"]`, { timeout: 30000 }).contains("have been uploaded.");
    }
  });
  it("Should submit to MO", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
    cy.clickOn("Submit claim");
    cy.heading("Claims");
  });
  it("Should navigate back to project", () => {
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
  });
  it("Should switch user to MO and access claim tile", () => {
    cy.switchUserTo(mo);
    cy.selectTile("Claims");
    cy.heading("Claims");
  });
  it("Should click review and then query the claim back", () => {
    cy.get("td").contains("EUI Small Ent Health (Lead)").siblings().contains("Review").click();
    cy.heading("Claim");
    cy.getByQA("status_MO Queried").click({ force: true });
    cy.wait(200);
    cy.get("textarea").clear().type("Test");
    cy.clickOn("Send query");
    cy.heading("Claims");
  });
  it("Should navigate back to project", () => {
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
  });
  it("Should switch user to fc", () => {
    cy.switchUserTo(fc);
  });
  it("Should access the Claims tile and the claim", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.get("td").contains("Edit").click();
    cy.heading("Costs to be claimed");
  });
  it("Should navigate to docs page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should delete all docs", () => {
    cy.get("main").within(() => {
      cy.get("tr").then($rows => {
        let numberOfRows = $rows.length - 1;
        if (numberOfRows > 0) {
          for (let i = 0; i < numberOfRows; numberOfRows--) {
            cy.intercept("DELETE", `/api/documents/claims/**`).as("fileDelete");
            cy.log("Number of files left to delete is " + numberOfRows.toString());
            cy.get("tr")
              .eq(1)
              .within(() => {
                cy.clickOn("Remove");
              });
            cy.wait("@fileDelete");
            cy.get(`[data-qa="validation-message-content"]`, { timeout: 30000 }).contains("has been removed.");
          }
        }
      });
    });
  });
});
