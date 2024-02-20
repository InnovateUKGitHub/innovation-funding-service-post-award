import { revertSpendTableZero, spendTableEdit, spendTableWithinGOL } from "common/spend-table-edit";
import { visitApp } from "../../common/visit";
import {
  checkSpendProfileIncomplete,
  correctSpendProfileTotals,
  reaccessSpendProfile,
  saveAndRemoveValidationMsg,
  saveAndValidate,
  shouldShowProjectTitle,
  spendProfileNullValidation,
  spendTableTidyUp,
  submitComplete,
} from "./steps";
import { topThreeRows } from "e2e/5-forecasts/steps";
import { spendLabourCalculateOH } from "./steps";
import { spendTableValues } from "common/spend-table-values";

const pmEmail = "james.black@euimeabs.test";

describe("Project setup > IFS > Set spend profile", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
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

  it("Should check for existing forecast figures", spendTableTidyUp);

  it("Should display the forecast table", correctSpendProfileTotals);

  it("Should display the correct top three rows including IAR frequency", topThreeRows);

  it("Should correctly calculate overheads against labour input", spendLabourCalculateOH);

  it("Should edit the forecast table and calculate the new totals correctly", spendTableEdit);

  it("Should save and return", () => {
    cy.button("Save and return to project setup").click();
    cy.heading("Project setup");
  });

  it("Should navigate to the spend profile section", () => {
    cy.get("a").contains("Set spend profile").click();
    cy.heading("Spend Profile");
  });
  it("Should check that all costs saved correctly", spendTableValues);

  it("Should enter a null value and prompt correct validation message", spendProfileNullValidation);

  it("Should Mark as complete and attempt to save table, prompting validation.", saveAndValidate);

  it("Should enter correct figures within GOL value", spendTableWithinGOL);

  it("Validation messaging should no longer be present", saveAndRemoveValidationMsg);

  it("Should submit the spend profile and return to see that the section is now marked 'Complete'.", submitComplete);

  it("Should access the spend profile page again.", reaccessSpendProfile);

  it("Should untick the setup complete box", () => {
    cy.get("h2").contains("Mark as complete");
    cy.getByLabel("This is ready to submit").click();
  });

  it("Should clear the cost categories back to zero", revertSpendTableZero);

  it("Should check that the spend profile section is incomplete", checkSpendProfileIncomplete);
});
