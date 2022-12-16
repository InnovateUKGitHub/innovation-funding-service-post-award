import { visitApp } from "../../common/visit";
import {
  displayForecastTable,
  forecastCostCats,
  forecastHeaders,
  savedFromPrev,
  shouldShowProjectTitle,
} from "./steps";

describe("Updating forecasts after claim costs and document upload", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1/documents");
  });

  it("Should have a back option", () => {
    cy.get(".govuk-back-link").contains("Back to costs to be claimed");
  });

  it("Should let you navigate from the documents screen to forecasts", () => {
    cy.get("a#continue-claim.govuk-button").click();
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should have forecasts header", () => {
    cy.get("h1").contains("Update forecast");
  });

  it("Should contain a 'last chance to change the forecast' message", () => {
    cy.getByQA("validation-message-content").contains("last chance");
  });

  it("Should display the forecast table", displayForecastTable);

  it("Should contain the correct table headers", forecastHeaders);

  it("Should contain the correct cost categories", forecastCostCats);

  /**
   * Please note below that as projects progress through different periods, the below period categories may need to be adjusted accordingly when testing.
   * If using a project that's currently in 'Period 2' you would need to update 'Period 3' and so on. Cannot update forecasts for period you're in.
   */
  it("Should accept input and calculate the figures accordingly", () => {
    cy.getByAriaLabel("Labour Period 2").clear().type("1000");
    cy.get("td.govuk-table__cell.sticky-col.sticky-col-right-3.govuk-table__cell--numeric").contains("£1,100.00");
    cy.getByAriaLabel("Overheads Period 2").clear().type("1000");
  });

  it("Should save and return to claims", () => {
    cy.getByQA("button_save-qa").click();
    cy.wait(6000);
  });

  it("Should re-open the claim", () => {
    cy.get("a.govuk-link").contains("Edit").click();
    cy.wait(3000);
  });

  it("Should navigate to documents", () => {
    cy.getByQA("button_default-qa").click();
    cy.wait(6000);
  });

  it("Should continue through to forecast page again", () => {
    cy.get("a#continue-claim.govuk-button").click();
  });

  it("Should have saved the information from previous edit", savedFromPrev);

  it("Should display a 'Changes last saved' message", () => {
    cy.getByQA("last-updated").contains("Changes last saved");
  });

  it("Should continue to summary", () => {
    cy.getByQA("button_default-qa").click();
  });
});
