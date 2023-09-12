import { visitApp } from "../../common/visit";

const pmEmail = "james.black@euimeabs.test";
const moEmail = "testman2@testing.com";

describe("Forecast > Partner table as PM/MO before navigating to forecast", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
    cy.navigateToProject("223377");
  });

  it("Should click the Forecast tile and bring up the partner table", () => {
    cy.selectTile("Forecasts");
    cy.heading("Forecasts");
  });

  it("Should display the partner table with the correct headers", () => {
    ["Partner", "Total eligible costs", "Forecasts and costs", "Underspend", "Date of last update"].forEach(header => {
      cy.tableHeader(header);
    });
  });

  /**
   * 'Never' referenced below is only visible to screen readers or by looking into the HTML.
   * This will be testable only when table cell is blank.
   */
  it("Should display a blank field beneath 'Date of last update'", () => {
    cy.get("tr")
      .eq(2)
      .within(() => {
        cy.get("td:nth-child(5)").contains("Never");
      });
  });

  it("Should switch to MO and repeat the check", () => {
    cy.switchUserTo(moEmail);
    cy.get("tr")
      .eq(2)
      .within(() => {
        cy.get("td:nth-child(5)").contains("Never");
      });
  });
});
