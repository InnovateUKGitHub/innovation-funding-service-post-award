import { visitApp } from "../../common/visit";
import { clickForecastsTile, displayForecastTable, navigateToProject } from "./steps";

const financeContactEmail = "wed.addams@test.test.co.uk";

/**
 * See ACC-9157 for the original issue this test relates to
 */

describe("Test the claims link from Forecast Page", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    navigateToProject();
  });

  it("should click the forecast tile", clickForecastsTile);

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("should show the forecast table", displayForecastTable);

  it("should click the 'make a claim' link and land you on the claimsDashboard", () => {
    cy.get("a.govuk-link").contains("make a claim").click({ force: true });
    cy.getByPageQA("claimsDashboard").should("exist", { timeout: 5000 });
  });
});
