import { visitApp } from "../../common/visit";
import {
  accessOpenClaim,
  ktpAssociateEmployment,
  ktpCorrectCats,
  ktpForecastUpdate,
  ktpGuidance,
  shouldShowProjectTitle,
  nonFECMessaging,
  costCatAwardOverrideMessage,
  impactGuidance,
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

  it("Should display 'Costs to be claimed' title and guidance messaging", () => {
    cy.heading("Costs to be claimed");
    nonFECMessaging();
    costCatAwardOverrideMessage("associate employment", "70%");
    costCatAwardOverrideMessage("travel and subsistence", "20%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
  });

  it("Should contain the correct KTP cost categories", ktpCorrectCats);

  it("Should click into the 'Associate Employment' category and take you to that page", () => {
    cy.clickOn("td", "Associate Employment");
  });

  it("Should have Associate Employment page heading and guidance", () => {
    cy.heading("Associate Employment");
    nonFECMessaging();
    costCatAwardOverrideMessage("travel and subsistence", "20%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
    cy.list("This cost category is paid at a rate of 70% rather than your normal award rate");
  });

  it("Should click 'Back to claim'", () => {
    cy.clickOn("Back to claim");
  });

  it("Should click into 'Travel and subsistence' and check the copy", () => {
    cy.clickOn("Travel and subsistence");
    cy.heading("Travel and subsistence");
    cy.list("This cost category is paid at a rate of 20% rather than your normal award rate");
    costCatAwardOverrideMessage("associate employment", "70%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
  });

  it("Should click 'Back to claim'", () => {
    cy.clickOn("Back to claim");
  });

  it("Should click 'Continue to claims documents' and land on the right page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should have KTP guidance messaging around document uploads", ktpGuidance);

  it("Should click 'Continue to update forecast' and ensure correct cost categories are listed", ktpForecastUpdate);

  it(
    "Should update 'Associate Employment' fields with a figure and check the new costs are calculated",
    ktpAssociateEmployment,
  );

  it("Should continue to summary and display the correct messaging", () => {
    cy.clickOn("Continue to summary", { force: true });
    cy.heading("Claim summary");
  });

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should display correct messaging", () => {
    nonFECMessaging();
    costCatAwardOverrideMessage("associate employment", "70%");
    costCatAwardOverrideMessage("travel and subsistence", "20%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
  });

  it("Should have a Supporting statement", () => {
    cy.get("legend").contains("Supporting statement");
    cy.get("#hint-for-comments").contains(
      "You must write a supporting statement for your claim. All supporting information for your monitoring officer and Innovate UK must be included here.",
    );
  });
});
