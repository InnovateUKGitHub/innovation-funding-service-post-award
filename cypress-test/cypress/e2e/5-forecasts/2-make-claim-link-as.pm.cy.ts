import { visitApp } from "../../common/visit";
import { clickForecastTile, displayForecastTable, navigateToProject, shouldShowAllAccordion } from "./steps";

const projectManagerEmail = "james.black@euimeabs.test";

/**
 * See ACC-9157 for the original issue this test relates to
 */

describe("Test the claims link from Forecast Page", () => {
  before(() => {
    visitApp({ asUser: projectManagerEmail });

    navigateToProject();
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display the partner table", () => {
    cy.tableHeader("Partner");
    cy.tableHeader("Total eligible costs");
    cy.tableHeader("Forecasts and costs");
    cy.tableHeader("Underspend");
    cy.tableHeader("Date of last update");
  });

  it("Should click the first View forecast link", () => {
    cy.contains("td", "EUI Small Ent Health (Lead)").siblings().contains("a", "View forecast").click();
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("should show the forecast table", displayForecastTable);

  it("should click the 'make a claim' link and land you on the allClaimsDashboard page", () => {
    cy.get("a.govuk-link").contains("make a claim").click({ force: true });
    cy.getByPageQA("allClaimsDashboard").should("exist", { timeout: 5000 });
  });

  it("Should display the claims header", () => {
    cy.get("h1").contains("Claims", { timeout: 10000 });
  });

  it("Should have accordions for other projects", shouldShowAllAccordion);
});
