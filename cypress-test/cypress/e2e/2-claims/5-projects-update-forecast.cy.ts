import { visitApp } from "../../common/visit";
import {
  acceptInputAndUpdate,
  accessEUIOpenClaim,
  forecastCostCats,
  topThreeRows,
  savedFromPrev,
  shouldShowProjectTitle,
  validateForecast,
} from "./steps";

const pm = "james.black@euimeabs.test";

describe("claims > Updating forecasts after claim costs and document upload", () => {
  before(() => {
    visitApp({ asUser: pm });
    cy.navigateToProject("328407");
  });

  it("Should select the Claims tile, edit the current claim and navigate to documents page", () => {
    cy.selectTile("Claims");
    cy.get("a").contains("Edit").click();
    cy.button("Continue to claims documents").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to costs to be claimed");
  });

  it("Should let you navigate from the documents screen to forecasts", () => {
    cy.get("a#continue-claim.govuk-button").click();
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should have forecasts header", () => {
    cy.heading("Update forecast");
  });

  it("Should display the Period, IAR and Month rows correctly", topThreeRows);

  it("Should contain the correct cost categories", forecastCostCats);

  /**
   * Please note below that as projects progress through different periods, the below period categories may need to be adjusted accordingly when testing.
   * If using a project that's currently in 'Period 2' you would need to update 'Period 3' and so on. Cannot update forecasts for period you're in.
   */
  it("Should validate when null value is entered as a forecast", validateForecast);

  it("Should accept input and calculate the figures accordingly", acceptInputAndUpdate);

  it("Should display messaging when under claiming", () => {
    [
      "Materials period 2",
      "Capital usage period 2",
      "Subcontracting period 2",
      "Travel and subsistence period 2",
      "Other costs period 2",
      "Other costs 2 period 2",
      "Other costs 3 period 2",
      "Other costs 4 period 2",
    ].forEach(category => {
      cy.getByAriaLabel(category).clear().type("1");
    });
    [
      "The total of your actual costs claimed and forecasted costs is different than the agreed for:",
      "Labour",
      "Overheads",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
      "Please add a comment for the attention of your Monitoring Officer, if you are forecasting to underspend on the grant offered.",
    ].forEach(advice => {
      cy.get("p").contains(advice);
    });
  });
});

it("Should display messaging when over claiming", () => {
  [
    "Labour period 2",
    "Materials period 2",
    "Capital usage period 2",
    "Subcontracting period 2",
    "Travel and subsistence period 2",
    "Other costs period 2",
    "Other costs 2 period 2",
    "Other costs 3 period 2",
    "Other costs 4 period 2",
  ].forEach(category => {
    cy.getByAriaLabel(category).clear().type("50000");
    [
      "The total of your actual costs claimed and forecasted costs is different than the agreed for:",
      "Labour",
      "Overheads",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
      "Please add a comment for the attention of your Monitoring Officer, if you are forecasting to underspend on the grant offered.",
    ].forEach(advice => {
      cy.get("p").contains(advice);
    });
  });

  it("Should save and return to claims", () => {
    cy.getByQA("button_save-qa").click({ force: true });
  });

  it("Should re-open the claim", accessEUIOpenClaim);

  it("Should navigate to documents", () => {
    cy.button("Continue to claims documents").click();
  });

  it("Should continue through to forecast page again", () => {
    cy.get("a#continue-claim.govuk-button").click();
  });

  it("Should have saved the information from previous edit", savedFromPrev);

  it("Should display a 'Changes last saved' message", () => {
    cy.getByQA("last-updated").contains("Changes last saved");
  });

  it("Should continue to summary", () => {
    cy.submitButton("Continue to summary").click();
    cy.heading("Claim summary");
  });
});
