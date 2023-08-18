import { visitApp } from "../../common/visit";
import {
  abCadFcDelete,
  checkABCadVisibility,
  fcLoginDelete,
  fcLoginViewFile,
  fcShouldNotDelete,
  fcUploadToEUI,
  moLoginViewFile,
  pmLoginDelete,
  pmLoginViewFile,
  pmShouldNotDelete,
  pmUploadToEUI,
  uploadABCadFc,
} from "./steps";
const fcEmail = "wed.addams@test.test.co.uk";

describe("Documents visibility between roles", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kSvOGEA0/documents" });
  });

  it("Should upload a document against EUI Small Ent Health from the FC", fcUploadToEUI);

  it("Should show correct guidance for EUI Small Ent Health", () => {
    cy.paragraph(
      'Documents stored here are only accessible to Innovate UK, the Monitoring Officer and participants representing "EUI Small Ent Health".',
    );
  });

  it("Should not show access control", () => {
    cy.getByQA("field-partnerId").should("not.exist");
  });

  it(
    "Should log out from FC and back in as PM (same partner) who can view the document uploaded by FC",
    pmLoginViewFile,
  );

  it("Should show correct guidance for EUI Small Ent Health", () => {
    cy.paragraph(
      'Documents stored here are only accessible to Innovate UK, the Monitoring Officer and participants representing "EUI Small Ent Health".',
    );
  });

  it("Should not show access control", () => {
    cy.getByQA("field-partnerId").should("not.exist");
  });

  it("Should not show a file uploaded by IUK in Salesforce", () => {
    cy.get("body").contains("documentUploadedByIUK.docx").should("not.exist");
  });

  it("Should not allow the PM to delete an FC file", pmShouldNotDelete);

  it("Should upload a document against EUI Small Ent Health from the PM", () => {
    pmUploadToEUI();
  });

  it(
    "Should log back in as FC and check they can view the file and is unable to delete the PM's file",
    fcLoginViewFile,
  );

  it("Should not allow the FC to delete a PM file", fcShouldNotDelete);

  it("Should not show a file uploaded by IUK in Salesforce", () => {
    cy.get("body").contains("documentUploadedByIUK.docx").should("not.exist");
  });

  it("Should log in as MO and ensure they can see both test files", moLoginViewFile);

  it("Should show correct guidance messaging", () => {
    cy.paragraph(
      "This page displays documents which are shared with Innovate UK and each project participant. Documents shared here are only accessible to the monitoring officer. Documents shared with the finance contact and project manager (for lead applicant), are accessible only to that participant, Innovate UK and the monitoring officer. When uploading documents, you can choose whether they are accessible by Innovate UK only, or with a participant.",
    );
    cy.paragraph("Do not select a participant if you wish to share the file with Innovate UK only.");
    cy.paragraph(
      "You must upload supporting documents on the page you are submitting your claim or PCR. Do not use this page for claims or PCRs.",
    );
  });

  it("Should also display the file uploaded by IUK in Salesforce", () => {
    cy.get("body").contains("documentUploadedByIUK.docx").should("exist");
  });

  it("Should not allow the MO to delete a file", fcShouldNotDelete);

  it(
    "Should navigate back to project dashboard, log in as AB Cad Services Finance Contact and check they do NOT have visibility of the file",
    checkABCadVisibility,
  );

  it("Should upload a file under A B Cad Services", uploadABCadFc);

  it("Should navigate back to project", () => {
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
  });

  it("Should log back in as EUI FC and delete the EUI documents uploaded", fcLoginDelete);

  it("Should check that the EUI FC cannot see the A B Cad document", () => {
    cy.tableCell("testfileABCadFc.doc").should("not.exist");
  });

  it("Should log back in as EUI PM and delete the file", pmLoginDelete);

  it("Should check that the EUI PM cannot see the A B Cad document", () => {
    cy.tableCell("testfileABCadFc.doc").should("not.exist");
  });

  it("Should log back in as the A B Cad FC and delete the document", abCadFcDelete);
});
