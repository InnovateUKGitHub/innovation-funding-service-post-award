import { visitApp } from "../../common/visit";
import {
  clickEditDisplayClaim,
  clickForecastTile,
  displayForecastTable,
  makeClaimFC,
  shouldShowProjectTitle,
} from "./steps";

const financeContactEmail = "wed.addams@test.test.co.uk";

/**
 * See ACC-9157 for the original issue this test relates to
 */

describe("Forecast > Link to claims page as FC", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("should show the forecast table", displayForecastTable);

  it("should click the 'make a claim' link and land you on the claimsDashboard", makeClaimFC);

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

  it("Will allow the FC to click edit and it will display the claims page", clickEditDisplayClaim);

  it("Has a 'Continue to claims document' button", () => {
    cy.get("button").contains("Continue to claims documents");
  });

  it("Has a 'Save and return to claims' button", () => {
    cy.get("button").contains("Save and return to claims");
  });
});
