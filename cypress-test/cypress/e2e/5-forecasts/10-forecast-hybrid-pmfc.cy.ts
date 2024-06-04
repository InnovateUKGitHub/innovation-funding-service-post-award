import { visitApp } from "common/visit";
import {
  accessAbCadForecast,
  accessEuiSmallEntHealthForecast,
  displayEUIForecast,
  noEditForecastLink,
  viewAbCadForecast,
} from "./steps";
const projectManagerEmail = "james.black@euimeabs.test";
describe("View forecast as hybrid PM/FC user", () => {
  before(() => {
    visitApp({ asUser: projectManagerEmail });
    cy.navigateToProject("328407");
  });

  it("Should access the Forecast tile", () => {
    cy.selectTile("Forecasts");
    cy.heading("Forecasts");
  });

  it("Should access EUI Small Ent Health Forecast", accessEuiSmallEntHealthForecast);

  it("Should display the correct EUI Small Ent Health forecast data", displayEUIForecast);

  it("Should click 'Edit forecast' button and edit the table", () => {
    cy.clickOn("Edit forecast");
    cy.getByAriaLabel("Labour Period 2").should("have.value", "-3333.33");
  });

  it("Should click the backlink and access A B Cad Services", () => {
    cy.backLink("Back to forecast").click();
    cy.backLink("Back to forecasts").click();
    cy.heading("Forecast");
    accessAbCadForecast();
  });

  it("Should see data for A B Cad", viewAbCadForecast);

  it("Should not have a link to edit the forecast", noEditForecastLink);
});
