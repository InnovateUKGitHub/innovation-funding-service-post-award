import { visitApp } from "common/visit";
import { drgClaimTwo, finalClaimPcfGuidance, impactGuidance, uploadProjectCompletionForm } from "./steps";
import { fileTidyUp } from "common/filetidyup";

const fcContact = "pauline.o'jones@uobcw.org.uk.test.prod";

describe("Claims > Final claim PCF Validation", () => {
  before(() => {
    visitApp({ asUser: fcContact, path: "projects/a0E2600000kSvOGEA0/overview" });
  });

  it("Should navigate to the claims tile and access the period 2 claim for Deep Rock Galactic", drgClaimTwo);

  it("Should display final claim notification.", () => {
    cy.validationNotification("This is the final claim.");
  });

  it("Should proceed to Claims documents page.", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should delete any documents present on the page.", () => {
    fileTidyUp("Paulina Jones");
  });

  it("Should display the final claim messaging and guidance on what is required.", finalClaimPcfGuidance);

  it("Should proceed to Summary page.", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should display final claim notification.", () => {
    cy.validationNotification("This is the final claim.");
  });

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should have a disabled Submit button", () => {
    cy.button("Submit").should("be.disabled");
  });

  it("Should now access documents page using the link on the Summary page", () => {
    cy.clickOn("Edit claim documents");
    cy.heading("Claim documents");
  });

  it("Should upload a file and mark it as Project Completion Form", uploadProjectCompletionForm);

  it("Should navigate back to the Claim summary page and show an enabled Submit button", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
    cy.button("Submit").should("be.enabled");
  });

  it("Should go back to documents page and delete the file uploaded previously", () => {
    cy.clickOn("Edit claim documents");
    cy.heading("Claim documents");
    cy.clickOn("Remove");
    cy.validationNotification("has been removed.");
  });

  it("Should proceed to Summary page.", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should have a disabled Submit button", () => {
    cy.button("Submit").should("be.disabled");
  });
});
