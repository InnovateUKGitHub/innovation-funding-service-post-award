import { visitApp } from "common/visit";
import { drgClaimTwo, finalClaimPcfGuidance, impactGuidance } from "./steps";
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

  it("Should have an enabled submit button but clicking it throws a PCF error", () => {
    cy.button("Submit").click();
    cy.validationLink("You must upload a project completion form before you can submit this claim.");
  });
});
