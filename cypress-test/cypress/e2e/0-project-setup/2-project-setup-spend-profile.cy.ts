import { spendTableEdit } from "common/spend-table-edit";
import { visitApp } from "../../common/visit";
import { displayForecastTable, shouldShowProjectTitle } from "./steps";

describe("Project setup > Set spend profile", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("365447");
  });

  it("Should navigate to the spend profile section", () => {
    cy.get("a").contains("Set spend profile").click();
    cy.get("h1").contains("Spend Profile");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to set up your project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have guidance information", () => {
    cy.get("p").contains(
      "You must provide a forecast of all eligible project costs to reflect your spend throughout the project.",
    );
  });

  it("Should display the forecast table", displayForecastTable);

  it("Should edit the forecast table and calculate the new totals correctly", spendTableEdit);

  it("Should Mark as complete and have a 'Save and return to project setup' button", () => {
    cy.get("h2").contains("Mark as complete");
    cy.clickCheckBox("This is ready to submit");
    cy.submitButton("Save and return to project setup");
  });
});
