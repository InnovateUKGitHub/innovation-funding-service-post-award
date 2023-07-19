import { visitApp } from "../../common/visit";
import {
  clickForecastsTile,
  clickViewDisplayClaim,
  displayForecastTableCostCategories,
  makeClaimPM,
  shouldShowAllAccordion,
  shouldShowProjectTitle,
  forecastPartnerTable,
} from "./steps";

const projectManagerEmail = "james.black@euimeabs.test";

/**
 * See ACC-9157 for the original issue this test relates to
 */

describe("Forecast > link to claims page as PM", () => {
  before(() => {
    visitApp({ asUser: projectManagerEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastsTile);

  it("Should display the partner table", forecastPartnerTable);

  it("Should click the first View forecast link", () => {
    cy.contains("td", "EUI Small Ent Health (Lead)").siblings().contains("a", "View forecast").click();
  });

  it("Should display a page heading", () => {
    cy.heading("Forecast");
  });

  it("should show the forecast table", displayForecastTableCostCategories);

  it("should click the 'make a claim' link and land you on the allClaimsDashboard page", makeClaimPM);

  it("Should display the claims header", () => {
    cy.heading("Claims");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have an Open claims section", () => {
    cy.get("h2").contains("Open");
  });

  it("Should have a Closed claims section", () => {
    cy.get("h2").contains("Closed");
  });

  it("Should have accordions for other projects", shouldShowAllAccordion);

  it("Should allow you to click view and it will display the claims page", clickViewDisplayClaim);
});
