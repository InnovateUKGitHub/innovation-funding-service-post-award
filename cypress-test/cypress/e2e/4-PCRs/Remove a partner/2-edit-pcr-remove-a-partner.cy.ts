import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, showPartners } from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

const pm = "james.black@euimeabs.test";

describe("PCR > Remove partner > Begin editing the Remove a partner section", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Remove partner PCR", () => {
    cy.createPcr("Remove a partner");
  });

  it("Should click the Remove partner link to begin editing the PCR", () => {
    cy.get("a").contains("Remove a partner").click();
    cy.heading("Remove a partner");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have a subheading for 'Select partner to remove'", () => {
    cy.get("legend").contains("Select partner to remove");
  });

  it("Should have a list of partners and the option to select which partner you wish to remove", showPartners);

  it("Should have a 'When is their last period?' heading", () => {
    cy.get("legend").contains("When is their last period?");
  });

  it("Should have guidance information", () => {
    cy.get("#hint-for-removalPeriod").contains(
      "The partner can make a claim for this period before being removed. If they have a claim in progress, they will be removed once that claim has been paid.",
    );
  });

  it("Should 'Save and continue' having entered nothing and selected nothing", () => {
    cy.button("Save and continue").click();
    cy.get("legend").contains("Upload withdrawal of partner certificate");
    cy.button("Save and continue").click();
    cy.get("legend").contains("Mark as complete");
  });

  it("Should mark as complete and attempt to save prompting validation", () => {
    cy.getByLabel("I agree with this change").click();
    cy.wait(500);
    cy.button("Save and return to request").click();
    cy.validationLink("Enter a removal period");
    cy.validationLink("Select a partner to remove from this project.");
  });

  it("Should use the edit button next to 'Partner being removed' to navigate back", () => {
    cy.getListItemFromKey("Partner being removed", "Edit").click();
    cy.get("legend").contains("Select partner to remove");
  });

  it("Should validate the period box", () => {
    cy.getByLabel("Removal period").clear().type("13");
    cy.wait(1000);
    cy.button("Save and continue").click();
    cy.validationLink("Period must be 12 or fewer");
    cy.paragraph("Period must be 12 or fewer");
    cy.getByLabel("Removal period").clear().type("not a number");
    cy.wait(1000);
    cy.button("Save and continue").click();
    cy.validationLink("Period must be a whole number, like 3.");
    cy.paragraph("Period must be a whole number, like 3.");
    ["!", "$", "%", "^", "&", "*"].forEach(specialChar => {
      cy.getByLabel("Removal period").clear().type(specialChar);
      cy.wait(1000);
      cy.button("Save and continue").click();
      cy.validationLink("Period must be a whole number, like 3.");
    });
  });

  it("Should have a working backlink", () => {
    cy.backLink("Back to request").click();
    cy.heading("Request");
  });
});
