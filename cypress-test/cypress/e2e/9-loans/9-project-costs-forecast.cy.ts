import { visitApp } from "common/visit";
import { shouldShowProjectTitle } from "e2e/2-claims/steps";
import {
  loansForecastCopyPaste,
  loansForecastDecimals,
  loansForecastEmptyCell,
  loansForecastLockedCols,
  loansForecastNavigate,
  loansForecastValidation,
  projCostsForecastTopThreeRows,
  updateLoansProjCostsForecast,
} from "./steps";

const fc = "s.shuang@irc.trde.org.uk.test";
describe("Loans > Forecast", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("191431");
  });

  it(
    "Should click the Project costs tile and navigate to forecast section of the open Project cost",
    loansForecastNavigate,
  );

  it("Should have a backlink", () => {
    cy.backLink("Back to claims documents");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should have forecast guidance", () => {
    cy.validationNotification("This is your last chance to change the forecast for period 2");
  });

  it("Should display the top three rows of the forecast table", projCostsForecastTopThreeRows);

  it("Should display the first two locked columns of the forecast table", loansForecastLockedCols);

  it("Should update the forecast table and calculate totals and difference correctly", updateLoansProjCostsForecast);

  it("Should display appropriate validation as total eligible costs have been exceeded", loansForecastValidation);

  it("Should handle decimals correctly", loansForecastDecimals);

  it("Should validate saving an empty cell", loansForecastEmptyCell);

  it("Should validate alpha characters copied and pasted", loansForecastCopyPaste);
});
