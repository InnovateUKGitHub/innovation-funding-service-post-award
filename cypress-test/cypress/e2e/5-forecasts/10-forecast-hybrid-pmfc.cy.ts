import { visitApp } from "common/visit";
import {
  accessAbCadForecast,
  accessEUIRemoveUnderspend,
  accessEuiSmallEntHealthForecast,
  displayEUIForecast,
  hybridForecastPartnerTable,
  hybridUpdateCostsReflect,
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

  it("Should display the project forecast partner table", hybridForecastPartnerTable);

  it("Should access EUI Small Ent Health Forecast", accessEuiSmallEntHealthForecast);

  it("Should display the correct EUI Small Ent Health forecast data", displayEUIForecast);

  it("Should click 'Edit forecast' button and edit the table", () => {
    cy.clickOn("Edit forecast");
    cy.getByAriaLabel("Labour Period 2").should("have.value", "-3333.33");
  });

  it("Should update the Materials costs, saving and reflecting on partner table", hybridUpdateCostsReflect);

  it("Should access EUI again and remove the updated forecast", accessEUIRemoveUnderspend);

  it("Should access A B Cad Services", accessAbCadForecast);

  it("Should see data for A B Cad", viewAbCadForecast);

  it("Should not have a link to edit the forecast", noEditForecastLink);
});
