import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  deletePcr,
  navigateToPartnerCosts,
  addPartnerDocUpload,
  addPartnerSummaryTable,
} from "../steps";

describe("Continuing editing Add a partner PCR project costs section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should click 'Save and continue'", () => {
    cy.submitButton("Save and continue").click();
  });

  it("Should click the 'No' radio button and then save and continue", () => {
    cy.get(`input[id="hasOtherFunding_false"]`).click();
    cy.submitButton("Save and continue").click();
  });

  it("Should display 'Funding level' heading and enter a percentage and click 'Save and continue'", () => {
    cy.get("h2").contains("Funding level");
    cy.get(`input[id="awardRate"]`).type("5");
    cy.submitButton("Save and continue").click();
  });

  it("Should land on a document upload page and contain 'Upload partner agreement' subheading and display guidance information", () => {
    cy.get("h2").contains("Upload partner agreement", { timeout: 10000 });
    cy.get("p").contains("You must upload copies of signed letters");
  });

  it("Should upload a file", addPartnerDocUpload);

  it("Should save and continue", () => {
    cy.getByQA("validation-message-content").contains("Your document has been uploaded", { timeout: 10000 });
    cy.submitButton("Save and continue").click();
  });

  it("Should now display a summary page with all completed sections", addPartnerSummaryTable);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should have a 'Mark as complete box'", () => {
    cy.get("h2").contains("Mark as complete");
    cy.clickCheckBox("I agree with this change");
  });

  it("Should have a 'Save and return to request' button", () => {
    cy.submitButton("Save and return to request").click();
  });
});
