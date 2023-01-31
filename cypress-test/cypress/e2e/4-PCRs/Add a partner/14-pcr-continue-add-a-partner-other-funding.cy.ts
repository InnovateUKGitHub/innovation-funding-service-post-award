import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  deletePcr,
  navigateToPartnerCosts,
  learnFiles,
  addPartnerDocUpload,
  pcrFileTable,
} from "../steps";

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
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

  it("Should display the 'Other public sector funding?' subheading and guidance information", () => {
    cy.get("h2").contains("Other public sector funding?", { timeout: 15000 });
    cy.get("p").contains("Is the new partner receiving any other public sector funding");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should click both radio buttons for 'Yes' and 'No'", () => {
    cy.get(`input[id="hasOtherFunding_true"]`).click();
    cy.get(`input[id="hasOtherFunding_false"]`).click();
    cy.get(`input[id="hasOtherFunding_true"]`).click();
  });

  it("Should click'Save and continue'", () => {
    cy.submitButton("Save and return to summary");
    cy.submitButton("Save and continue").click();
  });

  it("Should display guidance and the 'Other public sector funding?' subheading", () => {
    cy.get("p").contains("Include all sources of funding the new partner is receiving", { timeout: 10000 });
    cy.get("h2").contains("Other public sector funding?");
  });

  it("Should have a table containing any other sources of funding", () => {
    cy.tableHeader("Source of funding");
    cy.tableHeader("Date secured (MM YYYY)");
    cy.tableHeader("Funding amount (£)");
    cy.tableCell("Total other funding");
  });

  it("Should contain an 'Add another source of funding'", () => {
    cy.getByQA("add-fund").contains("Add another source of funding");
  });

  it("Should have a 'Save and continue' and 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });

  it("Should click 'Add another source of funding' and enter information", () => {
    cy.getByQA("add-fund").contains("Add another source of funding").click();
    cy.get(`input[id="item_0_description"]`).type("Public");
    cy.get(`input[id="item_0_date_month"]`).type("12");
    cy.get(`input[id="item_0_date_year"]`).type("2022");
    cy.get(`input[id="item_0_value"]`).type("50000");
    cy.wait(500);
  });

  it("Should reflect the value entered in the table", () => {
    cy.tableCell("£50,000.00");
  });

  it("Should 'Save and continue'", () => {
    cy.submitButton("Save and continue").click();
  });

  it("Should land on the 'Funding level' page and contain subheading and guidance information", () => {
    cy.get("h2").contains("Funding level", { timeout: 10000 });
    cy.get("p").contains("The maximum the new organisation can enter");
    cy.get("p").contains("The percentage applied for");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should enter a percentage and click 'Save and continue'", () => {
    cy.get(`input[id="awardRate"]`).type("5");
    cy.submitButton("Save and continue").click();
  });

  it("Should land on a document upload page and contain 'Upload partner agreement' subheading and display guidance information", () => {
    cy.get("h2").contains("Upload partner agreement", { timeout: 10000 });
    cy.get("p").contains("You must upload copies of signed letters");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should click the 'Learn more about files you can upload' and display information", learnFiles);

  it("Should upload a file", addPartnerDocUpload);

  it("Should display a document upload success message", () => {
    cy.getByQA("validation-message-content").contains("Your document has been uploaded", { timeout: 10000 });
  });

  it("Should display a file upload table once document is uploaded", pcrFileTable);

  it("Should click 'Save and continue'", () => {
    cy.submitButton("Save and return to summary");
    cy.submitButton("Save and continue").click();
  });
});
