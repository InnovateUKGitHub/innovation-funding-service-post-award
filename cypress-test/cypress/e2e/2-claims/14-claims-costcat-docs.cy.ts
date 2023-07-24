import { visitApp } from "common/visit";
import {
  allowBatchFileUpload,
  deleteClaimDocument,
  rejectElevenDocsAndShowError,
  documents as uploadDocuments,
} from "./steps";

const fcEmail = "s.shuang@irc.trde.org.uk.test";

const uploadDate = new Date().getFullYear().toString();

const documents = uploadDocuments.reverse();

describe("Claims > Cost category document uploads", () => {
  before(() => {
    visitApp({ asUser: fcEmail });
    cy.navigateToProject("328407");
  });

  it("Should click the claims tile and access the 'Exceptions - Staff' cost category", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.getByQA("current-claims-table").contains("Edit").click();
    cy.heading("Costs to be claimed");
    cy.tableCell("Exceptions - Staff").click();
    cy.heading("Exceptions - Staff");
  });

  it("Should click the upload and remove documents button ", () => {
    cy.button("Upload and remove documents").click();
    cy.heading("Exceptions - Staff documents");
  });

  it("should reject 11 documents and show an error", rejectElevenDocsAndShowError);

  it("Should upload a batch of 10 documents", { retries: 0 }, allowBatchFileUpload);

  it("Should see a success message for '10 documents have been uploaded'", { retries: 2 }, () => {
    cy.getByAriaLabel("success message").contains("10 documents have been uploaded.");
  });

  it("should filter the document list using the search bar");

  it("Should ensure all uploaded documents are displayed correctly", () => {
    cy.reload();

    documents.forEach((document, tableRow) => {
      cy.get("tr")
        .eq(tableRow + 1)
        .within(() => {
          cy.tableCell(document);
          cy.tableCell("Claim evidence");
          cy.tableCell(uploadDate);
          cy.tableCell("0KB");
          cy.tableCell("Sarah Shuang");
          cy.button("Remove");
        });
    });
  });

  it("Should navigate back to the cost category page and check the files are correctly showing there", () => {
    cy.backLink("Back to Exceptions - Staff").click();
    cy.heading("Exceptions - Staff");

    documents.forEach((document, tableRow) => {
      cy.getByQA("edit-claim-line-items-documents-container").within(() => {
        cy.get("tr")
          .eq(tableRow + 1)
          .within(() => {
            cy.tableCell(document);
            cy.tableCell("Claim evidence");
            cy.tableCell(uploadDate);
            cy.tableCell("0KB");
            cy.tableCell("Sarah Shuang");
          });
      });
    });
  });

  it("Should navigate back to the documents section and delete all files", { retries: 0 }, async () => {
    cy.button("Upload and remove documents").click();
    cy.heading("Exceptions - Staff documents");

    for (const document of documents) {
      deleteClaimDocument(document);
    }
  });
});
