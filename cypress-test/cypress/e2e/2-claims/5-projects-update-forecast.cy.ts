import { visitApp } from "../../common/visit";
import {
  acceptInputAndUpdate,
  accessEUIOpenClaim,
  displayForecastTable,
  forecastCostCats,
  forecastHeaders,
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

  it("Should contain a 'last chance to change the forecast' message", () => {
    cy.getByQA("validation-message-content").contains("last chance");
  });

  it("Should display the forecast table", displayForecastTable);

  it("Should contain the correct table headers", forecastHeaders);

  it("Should contain the correct cost categories", forecastCostCats);

  /**
   * Please note below that as projects progress through different periods, the below period categories may need to be adjusted accordingly when testing.
   * If using a project that's currently in 'Period 2' you would need to update 'Period 3' and so on. Cannot update forecasts for period you're in.
   */
  it("Should validate when null value is entered as a forecast", validateForecast);

  it("Should accept input and calculate the figures accordingly", acceptInputAndUpdate);

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
