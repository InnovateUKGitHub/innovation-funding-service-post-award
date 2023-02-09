import { visitApp } from "../../common/visit";
import { clickForecastTile, displayForecastTable, shouldShowProjectTitle, showPartnerTable } from "./steps";

const projectManagerEmail = "james.black@euimeabs.test";

describe("Forecast front page as PM", () => {
  before(() => {
    visitApp({ asUser: projectManagerEmail });

    cy.navigateToProjectWithClaims();
  });

  it("should click the forecast tile", clickForecastTile);

  it("Should display the partner table", showPartnerTable);

  it("Should click the first View forecast link", () => {
    cy.contains("td", "EUI Small Ent Health (Lead)").siblings().contains("a", "View forecast").click();
  });

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("should show the forecast table", displayForecastTable);

  it("Should display a page heading", () => {
    cy.get("h1").contains("Forecast");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should have a back link", () => {
    cy.backLink("Back to forecasts");
  });

  it("Should show the partner name", () => {
    cy.get("h2").contains("EUI Small Ent Health");
  });

  it("should show the forecast table", displayForecastTable);
});
