import { visitApp } from "../../../common/visit";
import { clickCreateRequestButtonProceed, shouldShowProjectTitle, showPartners } from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Remove partner > Begin editing the Remove a partner section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Remove a partner");
  });

  it("Should select 'Remove a partner' checkbox", () => {
    cy.clickCheckBox("Remove a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should click the Remove partner link to begin editing the PCR", () => {
    cy.get("a").contains("Remove a partner").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have the page title 'Remove a partner'", () => {
    cy.get("h1").contains("Remove a partner");
  });

  it("Should have a subheading for 'Select partner to remove'", () => {
    cy.get("h2").contains("Select partner to remove");
  });

  it("Should have a list of partners and the option to select which partner you wish to remove", showPartners);

  it("Should have a 'When is their last period?' heading", () => {
    cy.get("h2").contains("When is their last period?");
  });

  it("Should have guidance information", () => {
    cy.getByQA("field-removalPeriod").contains("The partner can make a claim for this period");
  });

  it("Should have an input box to enter the last period for the partner", () => {
    cy.get(`input[id="removalPeriod"]`).clear().type("3");
  });

  it("Should have a 'Save and continue' button", () => {
    cy.submitButton("Save and continue");
  });
});
