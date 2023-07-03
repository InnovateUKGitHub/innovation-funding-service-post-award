import { visitApp } from "../../common/visit";
import { clickForecastTile, displayForecastTable, shouldShowProjectTitle } from "./steps";

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
    cy.getByQA("forecastClaimAdvice").contains("You can only update forecasts");
  });

  it("should show the forecast table", displayForecastTable);

  it("Should have an 'Update forecast' button", () => {
    cy.get("a").contains("Update forecast");
  });
});
