import { euiCostCleanUp } from "common/costCleanUp";
import { visitApp } from "../../../common/visit";
import {
  acceptLabourCalculateOHJsDisabled,
  accessEUIOpenClaim,
  forecastCostCats,
  topThreeRows,
  savedFromPrev,
  shouldShowProjectTitle,
  validateForecast,
  updateClaimsForecastJsDisabled,
} from "./steps";

const pm = "james.black@euimeabs.test";

describe(
  "js-disabled > claims > Updating forecasts after claim costs and document upload",
  { tags: "js-disabled" },
  () => {
    before(() => {
      visitApp({ asUser: pm, jsDisabled: true });
      cy.navigateToProject("328407");
    });

    beforeEach(() => {
      cy.disableJs();
    });

    it("Should select the Claims tile, and edit the current claim ", () => {
      cy.selectTile("Claims");
      cy.clickOn("Edit");
      cy.heading("Costs to be claimed");
      euiCostCleanUp();
      cy.clickOn("Continue to claims documents");
      cy.heading("Claim documents");
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

    it("Should contain a 'last chance to change the forecast' message", () => {
      cy.validationNotification("last chance");
    });

    it("Should display the Period, IAR and Month rows correctly", topThreeRows);

    it("Should contain the correct cost categories", forecastCostCats);

    /**
     * Please note below that as projects progress through different periods, the below period categories may need to be adjusted accordingly when testing.
     * If using a project that's currently in 'Period 2' you would need to update 'Period 3' and so on. Cannot update forecasts for period you're in.
     */
    it("Should validate when null value is entered as a forecast", validateForecast);

    it("Should accept input across the table and calculate correctly", updateClaimsForecastJsDisabled);

    it("Should calculate overheads correctly", acceptLabourCalculateOHJsDisabled);

    it("Should save and return to claims", () => {
      cy.button("Save and return to claims").click({ force: true });
    });

    it("Should re-open the claim", accessEUIOpenClaim);

    it("Should navigate to documents", () => {
      cy.clickOn("Continue to claims documents");
    });

    it("Should continue through to forecast page again", () => {
      cy.get("a#continue-claim.govuk-button").click();
    });

    it("Should have saved the information from previous edit", savedFromPrev);

    it("Should display a 'Changes last saved' message", () => {
      cy.paragraph("Changes last saved");
    });

    it("Should continue to summary", () => {
      cy.clickOn("Continue to summary");
      cy.heading("Claim summary");
    });
  },
);
