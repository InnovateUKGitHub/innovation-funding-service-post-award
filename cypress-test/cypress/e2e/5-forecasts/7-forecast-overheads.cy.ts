import { visitApp } from "common/visit";
import {
  backToDash,
  clickForecastAccessEUI,
  clickEditCheckValues,
  clickEditForecastButton,
  displayCorrectOverheadRate,
  returnToForecastArea,
  submitForecastBackOut,
  updateLabourCalculateOH,
  saveNegativeValues,
  ohForecastCleanup,
} from "./steps";
const fcEmail = "james.black@euimeabs.test";

describe("Forecast > edit", { tags: "smoke" }, () => {
  before(() => {
    visitApp({ asUser: fcEmail });

    cy.navigateToProject("328407");
  });

  it("Should click the Forecast tile and access EUI Small Ent Health", clickForecastAccessEUI);

  it("Should click the update forecast button", clickEditForecastButton);

  it("Should display the correct overhead rate", displayCorrectOverheadRate);

  it("Should check that no costs are present in claims column but if so, clean up", ohForecastCleanup);

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

  it("Should click the update forecast button and check the value is correct", clickEditCheckValues);

  it("Should save down a negative value and check it displays correctly", saveNegativeValues);
});
