import { visitApp } from "common/visit";
import { triggerForecastCopy } from "./steps";
const fc = "contact77@test.co.uk";

describe("Internal Assurance > forecast tile copy", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("770699");
  });

  it("Should access the forecast tile, edit, trigger copy and assert correct copy", () => {
    cy.selectTile("Forecast");
    cy.heading("Forecast");
    cy.clickOn("Edit forecast");
    triggerForecastCopy();
  });
});
