import { visitApp } from "../../common/visit";
import {
  clickForecastTile,
  topThreeRows,
  correctTableHeaders,
  displayForecastTableCostCategories,
  forecastValues,
  correctForecastTotals,
  shouldShowProjectTitle,
  showPartnerTableHeadings,
  forecastPartnerTable,
  accessAbCadForecast,
  displayAbCadForecast,
  noEditForecastLink,
} from "./steps";

const projectManagerEmail = "james.black@euimeabs.test";

describe("Forecast front page as PM", () => {
  before(() => {
    visitApp({ asUser: projectManagerEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display a page heading", () => {
    cy.heading("Forecasts");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should display the partner table", showPartnerTableHeadings);

  it("Should show all partners on the project and an overview of finances", forecastPartnerTable);

  it("Should access the forecast for A B Cad Services", accessAbCadForecast);

  it("Should display the correct Forecast table for A B Cad Services", displayAbCadForecast);

  it("Should not have an edit button", () => {
    cy.get("a").should("not.contain", "Edit forecast");
    cy.get("a").should("not.contain", "Update forecast");
  });

  it("Should click 'Back to forecasts' backlink", () => {
    cy.backLink("Back to forecasts").click();
    cy.heading("Forecasts");
  });

  it("Should click into the forecast for EUI Small Ent Health", () => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(6)").contains("View forecast").click();
      });
  });

  it("Should display the Forecast heading and subheading for EUI Small Ent Health", () => {
    cy.heading("Forecast");
    cy.get("h2").contains("EUI Small Ent Health");
  });

  it("Should have forecast advice text", () => {
    cy.getByQA("forecastClaimAdvice").contains(
      "The Finance Contact can now amend the forecasted costs at any time (as long as the related period's claim has not yet been approved).",
    );
  });

  it("Should display the Period, IAR and Month rows correctly", topThreeRows);

  it("Should display the correct table headers", correctTableHeaders);

  it("should show the forecast table cost categories", displayForecastTableCostCategories);

  it("Should display correct Forecast values", forecastValues);

  it("Should display the correct totals", correctForecastTotals);

  it("Should have an 'Update forecast' button", noEditForecastLink);

  it("Should have a Changes last saved message", () => {
    cy.paragraph("Changes last saved");
  });
});
