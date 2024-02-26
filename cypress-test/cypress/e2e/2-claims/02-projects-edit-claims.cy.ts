import { visitApp } from "../../common/visit";
import { euiCostCleanUp, overheadsTidyUp } from "common/costCleanUp";
import { accessEUIOpenClaim, shouldShowCostCatTable, shouldShowProjectTitle } from "./steps";

describe("claims > edit claims as FC", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
  });

  it("Displays a claim in draft state", accessEUIOpenClaim);

  it("Should have a back option", () => {
    cy.backLink("Back to claims");
  });

  it("Displays the project title", shouldShowProjectTitle);

  it("Displays the period information", () => {
    cy.get("h2").should("contain.text", "Period");
  });

  it("Should check that Labour cost category is correct and if not, correct it.", euiCostCleanUp);

  it("Should check that Overheads cost category is correct and if not, correct it", overheadsTidyUp);

  it("Displays the cost category table", shouldShowCostCatTable);

  it("Should have continue to claims documents button", () => {
    cy.contains(/^Continue to claims documents$/);
  });

  it("Should have a save and return to claims button", () => {
    cy.contains(/^Save and return to claims$/);
  });

  it("Should show accordions", () => {
    cy.clickOn("Status and comments log");
    cy.paragraph("There are no changes");
  });

  it("The Continue to claims button should direct you to the next page", () => {
    cy.clickOn("Continue to claims documents");
  });
});
