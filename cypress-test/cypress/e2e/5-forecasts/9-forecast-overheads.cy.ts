import { visitApp } from "common/visit";
import {
  backToDash,
  clickForecastAccessEUI,
  clickUpdateCheckValues,
  clickUpdateForecastButton,
  displayCorrectOverheadRate,
  returnToForecastArea,
  submitForecastBackOut,
  updateLabourCalculateOH,
} from "./steps";
const fcEmail = "james.black@euimeabs.test";

describe("Forecast > edit", () => {
  before(() => {
    visitApp({ asUser: fcEmail });

    cy.navigateToProject("328407");
  });

  it("Should click the Forecast tile and access EUI Small Ent Health", clickForecastAccessEUI);

  it("Should click the update forecast button", clickUpdateForecastButton);

  it("Should display the correct overhead rate", displayCorrectOverheadRate);

  it(
    "Should update the labour with a value and auto-calculate the overheads to 2 decimal places",
    updateLabourCalculateOH,
  );

  it("Should submit the forecast and back out of Forecast page", submitForecastBackOut);

  it("Should back out of the Forecast area to Project dashboard", backToDash);

  it(
    "After reloading it will now go into the Forecasts tile, access the same forecast and re-check the figures",
    returnToForecastArea,
  );

  it("Should click the update forecast button and check the value is correct", clickUpdateCheckValues);
});
