import { visitApp } from "common/visit";
import { accessAndCheckFigures, independentLabourOHRows, shouldShowProjectTitle, spendTableTidyUpNoOH } from "./steps";
import { revertSpendTableZeroNoOHRate } from "common/spend-table-edit";

const fcEmail = "contact77@test.co.uk";

describe("Project setup > Set spend profile without an overhead rate", () => {
  before(() => {
    visitApp({ asUser: fcEmail });
    cy.navigateToProject("365447");
  });

  it("Should navigate to the spend profile section", () => {
    cy.get("a").contains("Set spend profile").click();
    cy.heading("Spend Profile");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to set up your project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have guidance information", () => {
    cy.paragraph(
      "You must provide a forecast of all eligible project costs to reflect your spend throughout the project.",
    );
  });

  it("Should check for existing forecast figures", spendTableTidyUpNoOH);

  it("Should have an overhead row independent to labour which will accept independent input", independentLabourOHRows);

  it("Should save and return to project setup", () => {
    cy.clickOn("Save and return to project setup");
    cy.heading("Project setup");
  });

  it("Should re-access spend profile and check that the figures saved correctly", accessAndCheckFigures);

  it("Should revert the spend table to zero", revertSpendTableZeroNoOHRate);
});
