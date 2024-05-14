import { visitApp } from "common/visit";
import { ktpCostCats, ktpUpdateForecast } from "./steps";

const fcContact = "contact77@test.co.uk";

describe("Forecast > KTP", () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp({ asUser: fcContact, path: "/projects/a0E2600000kTfqTEAS/overview" });
  });

  it("Should click the Forecast tile and continue to the Forecast page", () => {
    cy.selectTile("Forecast");
    cy.heading("Forecast");
    cy.get("h2").contains("A B Cad Services");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should display the forecast table with correct KTP cost categories", ktpCostCats);

  it("Should click 'Update forecast button'", () => {
    cy.get("a").contains("Edit forecast").click();
  });

  it("Should update the forecast table and calculate the entries correctly", ktpUpdateForecast);

  it("Should click 'Back to forecast'", () => {
    cy.backLink("Back to forecast").click();
    cy.heading("Forecast");
  });
});
