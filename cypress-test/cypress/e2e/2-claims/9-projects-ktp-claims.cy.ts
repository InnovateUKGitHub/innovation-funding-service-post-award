import { visitApp } from "../../common/visit";
import {
  accessOpenClaim,
  ktpAssociateEmployment,
  ktpCorrectCats,
  ktpCostsToClaim,
  ktpForecastUpdate,
  ktpGuidance,
  ktpHeadings,
  shouldShowProjectTitle,
} from "./steps";

describe("claims > KTP", () => {
  before(() => {
    visitApp({ path: "/projects/a0E2600000kTfqTEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Displays a claim in draft state", accessOpenClaim);

  it("Displays the project title", shouldShowProjectTitle);

  it("Should display 'Costs to be claimed' title and guidance messaging", ktpCostsToClaim);

  it("Should contain the correct KTP cost categories", ktpCorrectCats);

  it("Should click into the 'Associate Employment' category and take you to that page", () => {
    cy.get("td").contains("Associate Employment").click();
  });

  it("Should have Associate Employment page heading and guidance", ktpHeadings);

  it("Should click 'Back to claims'", () => {
    cy.backLink("Back to claims").click();
  });

  it("Should click 'Continue to claims documents' and land on the right page", () => {
    cy.button("Continue to claims documents").click();
    cy.heading("Claim documents");
  });

  it("Should have KTP guidance messaging around document uploads", ktpGuidance);

  it("Should click 'Continue to update forecast' and ensure correct cost categories are listed", ktpForecastUpdate);

  it(
    "Should update 'Associate Employment' fields with a figure and check the new costs are calculated",
    ktpAssociateEmployment,
  );

  it("Should continue to summary and display the correct messaging", () => {
    cy.button("Continue to summary").click({ force: true });
    cy.heading("Claim summary");
  });

  it("Should display correct messaging", () => {
    cy.validationNotification("This project does not follow the normal grant calculation rules");
    cy.validationNotification("The project and any partner may have one or more cost categories");
  });

  it("Should have a Supporting statement", () => {
    cy.get("legend").contains("Supporting statement");
    cy.get("#hint-for-comments").contains(
      "You must write a supporting statement for your claim. All supporting information for your monitoring officer and Innovate UK must be included here.",
    );
  });
});
