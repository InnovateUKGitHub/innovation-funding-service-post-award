import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  navigateToPartnerCosts,
  addPartnerDocUpload,
  addPartnerSummaryTable,
  fundingLevelPercentage,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should click 'Save and continue'", () => {
    cy.submitButton("Save and continue").click();
  });

  it("Should click the 'No' radio button and then save and continue", () => {
    cy.get("#hasOtherFunding_false").click();
    cy.submitButton("Save and continue").click();
  });

  it(
    "Should display 'Funding level' heading and enter a percentage and click 'Save and continue'",
    fundingLevelPercentage,
  );

  it("Should land on a document upload page and contain 'Upload partner agreement' subheading and display guidance information", () => {
    cy.get("h2").contains("Upload partner agreement");
    cy.paragraph("You must upload copies of signed letters");
  });

  it("Should upload a file", addPartnerDocUpload);

  it("Should save and continue", () => {
    cy.validationNotification("Your document has been uploaded");
    cy.submitButton("Save and continue").click();
  });

  it("Should now display a summary page with all completed sections", addPartnerSummaryTable);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should have a 'Mark as complete box'", () => {
    cy.get("h2").contains("Mark as complete");
    cy.clickCheckBox("I agree with this change");
  });

  it("Should have a 'Save and return to request' button", () => {
    cy.submitButton("Save and return to request").click();
  });
});
