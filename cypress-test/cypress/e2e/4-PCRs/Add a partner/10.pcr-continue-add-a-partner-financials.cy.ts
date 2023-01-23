import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, deletePcr, saveContinueSaveSummary, navigateToFinancialsPage } from "../steps";

describe("Continuing editing Add a partner PCR financial details section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should navigate to the Partner financials page", navigateToFinancialsPage);

  it("Should show the 'Financial details' heading and 'End of financial year' subheading", () => {
    cy.get("h2").contains("Financial details", { timeout: 10000 });
    cy.get("h2").contains("End of financial year");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should display guidance information", () => {
    cy.getByQA("field-financialYearEndDate").contains("This is the end of the last financial year");
  });

  it("Should enter a month and year of last financial year and enter a turnover amount", () => {
    cy.get(`input[id="financialYearEndDate_month"]`).type("03");
    cy.get(`input[id="financialYearEndDate_year"]`).type("2022");
    cy.get(`input[id="financialYearEndTurnover"]`).type("1000000");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
