import { visitApp } from "../../common/visit";
import { claimCommentBox, forecastView, shouldShowProjectTitle } from "./steps";

describe("Updating forecasts after claim costs and document upload", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/claims/a0D2600000z6KBxEAM/prepare/1/summary");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to update forecast");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should have Claims summary header", () => {
    cy.get("h1").contains("Claim summary");
  });

  it("Should show the Period heading", () => {
    cy.get("h2").contains("Period");
  });

  it("Should show Total costs to be claimed", () => {
    cy.get("dt.govuk-summary-list__key").contains("Total costs to be claimed");
  });

  it("Should show Funding level", () => {
    cy.get("dt.govuk-summary-list__key").contains("Funding level");
  });

  it("Should show Total costs to be paid", () => {
    cy.get("dt.govuk-summary-list__key").contains("Total costs to be paid");
  });

  it("Should have a link to edit claims costs", () => {
    cy.get("a#editCostsToBeClaimedLink.govuk-link").contains("Edit costs to be claimed");
  });

  it("Should have a link to edit claim documents", () => {
    cy.get("a#claimDocumentsLink.govuk-link").contains("Edit claim documents");
  });

  it("Should have forecast information", forecastView);

  it("Should have an Edit forecast link", () => {
    cy.get("a#editForecastLink.govuk-link").contains("Edit forecast");
  });

  it("Should have an add comments box with correct title and accepts text", claimCommentBox);

  it("Should correctly count the number of characters entered", () => {
    cy.get("p.character-count.character-count--default.govuk-body").contains("You have 926 characters remaining");
  });

  it("Should have pre-submission confirmation message", () => {
    cy.get("p.govuk-body").contains("I confirm that the information I have provided in this claim is correct,");
  });

  it("Should have a Save and return to claims button", () => {
    cy.getByQA("button_save-qa");
  });

  it("Should have a Submit claim button", () => {
    cy.getByQA("button_default-qa");
  });
});
