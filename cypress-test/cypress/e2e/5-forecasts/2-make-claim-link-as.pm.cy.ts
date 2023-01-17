import { visitApp } from "../../common/visit";
import {
  clickForecastTile,
  clickViewDisplayClaim,
  displayForecastTable,
  makeClaimPM,
  navigateToProject,
  shouldShowAllAccordion,
  shouldShowProjectTitle,
  showPartnerTable,
} from "./steps";

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

  it("Should display the partner table", showPartnerTable);

  it("Should click the first View forecast link", () => {
    cy.contains("td", "EUI Small Ent Health (Lead)").siblings().contains("a", "View forecast").click();
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("should show the forecast table", displayForecastTable);

  it("should click the 'make a claim' link and land you on the allClaimsDashboard page", makeClaimPM);

  it("Should display the claims header", () => {
    cy.get("h1").contains("Claims", { timeout: 10000 });
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
