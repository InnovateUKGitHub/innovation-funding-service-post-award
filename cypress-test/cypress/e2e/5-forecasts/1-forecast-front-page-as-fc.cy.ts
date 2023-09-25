import { visitApp } from "../../common/visit";
import {
  clickForecastTile,
  displayForecastTableCostCategories,
  shouldShowProjectTitle,
  topThreeRows,
  forecastValues,
  correctTableHeaders,
  correctForecastTotals,
} from "./steps";

const financeContactEmail = "wed.addams@test.test.co.uk";

describe("Forecast > front page as FC", () => {
  before(() => {
    visitApp({ asUser: financeContactEmail });

    cy.navigateToProject("879546");
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display a page heading", () => {
    cy.heading("Forecast");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to project");
  });

  it("Should have forecast advice text", () => {
    cy.paragraph(
      "You can now amend your forecasted costs at any time (as long as the related period's claim has not yet been approved).",
    );
  });

  it("Should display the Period, IAR and Month rows correctly", topThreeRows);

  it("Should display the correct table headers", correctTableHeaders);

  it("should show the forecast table cost categories", displayForecastTableCostCategories);

  it("Should display correct Forecast values", forecastValues);

  it("Should display the correct totals", correctForecastTotals);

  it("Should have an 'Edit forecast' button", () => {
    cy.get("a").contains("Edit forecast");
  });
});
