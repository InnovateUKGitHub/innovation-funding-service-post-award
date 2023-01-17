import { visitApp } from "../../common/visit";
import {
  clickEditDisplayClaim,
  clickForecastsTile,
  displayForecastTable,
  makeClaimFC,
  navigateToProject,
  shouldShowProjectTitle,
} from "./steps";

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
    cy.submitButton("Continue to claims documents");
  });

  it("Has a 'Save and return to claims' button", () => {
    cy.submitButton("Save and return to claims");
  });
});
