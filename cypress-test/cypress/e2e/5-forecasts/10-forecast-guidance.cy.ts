import { visitApp } from "common/visit";
import { clickForecastTile, shouldShowProjectTitle } from "./steps";

let financeContactEmail = "s.shuang@irc.trde.org.uk.test";
let pmEmail = "james.black@euimeabs.test";
let moEmail = "testman2@testing.com";

const costCategories = [
  "labour",
  "overheads",
  "materials",
  "capital usage",
  "subcontracting",
  "travel and subsistence",
  "other costs",
  "other costs 2",
  "other costs 3",
  "other costs 4",
  "other costs 5",
] as const;

describe("Forecast > Forecast guidance", () => {
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
    cy.getByQA("forecastClaimAdvice").contains(
      "You can now amend your forecasted costs at any time (as long as the related period's claim has not yet been approved).",
    );
  });

  it("Should show guidance on cost category values", () => {
    [
      "The amount you are requesting differs from the agreed costs for:",
      "Please amend your forecast costs to be in line with the grant offer letter.",
    ].forEach(message => {
      cy.getByQA("forecasts-warning-fc-content").contains(message);
      costCategories.forEach(costCat => {
        cy.getByQA("forecasts-warning-fc-content").within(() => {
          cy.list(costCat);
        });
      });
    });
  });

  it("Should back out of forecasts to home page", () => {
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
    cy.backLink("Back to Project").click();
    cy.heading("Dashboard");
    cy.backLink("Back to home page").click();
    cy.heading("Home");
  });

  it("Should switch user to the PM", { retries: 2 }, () => {
    cy.switchUserTo(pmEmail);
    cy.heading("Home");
    cy.get("#user-switcher-manual-input").should("have.value", pmEmail);
  });

  it("Should navigate to the correct project", () => {
    cy.navigateToProject("879546");
    cy.heading("Project overview");
  });

  it("Should navigate to Forecasts page for Deep Rock Galactic", () => {
    cy.selectTile("Forecasts");
    cy.heading("Forecasts");
    cy.get("tr")
      .eq(4)
      .within(() => {
        cy.tableCell("View forecast").click();
      });
    cy.heading("Forecast");
    cy.get("h2").contains("Deep Rock Galactic");
  });

  it("Should have PM forecast advice text", () => {
    cy.getByQA("forecastClaimAdvice").contains(
      "Your Finance Contact can now amend the forecasted costs at any time (as long as the related period's claim has not yet been approved).",
    );
  });

  it("Should show PM specific guidance on cost category values", () => {
    cy.getByQA("forecasts-warning-mo-pm-content").contains(
      "The amount you are requesting differs from the agreed costs for:",
    );
    costCategories.forEach(costCat => {
      cy.getByQA("forecasts-warning-mo-pm-content").within(() => {
        cy.list(costCat);
      });
    });
  });

  it("Should back out of forecasts to home page", () => {
    cy.backLink("Back to forecasts").click();
    cy.heading("Forecasts");
    cy.backLink("Back to project").click();
    cy.heading("Project overview");
    cy.backLink("Back to Project").click();
    cy.heading("Dashboard");
    cy.backLink("Back to home page").click();
    cy.heading("Home");
  });

  it("Should switch user to the MO", { retries: 2 }, () => {
    cy.switchUserTo(moEmail);
    cy.get("#user-switcher-manual-input").should("have.value", moEmail);
  });

  it("Should access Forecasts page for Deep Rock Galactic as MO", () => {
    cy.navigateToProject("879546");
    cy.heading("Project overview");
    cy.selectTile("Forecasts");
    cy.heading("Forecasts");
    cy.get("tr")
      .eq(4)
      .within(() => {
        cy.tableCell("View forecast").click();
      });
    cy.heading("Forecast");
    cy.get("h2").contains("Deep Rock Galactic");
  });

  it("Should have MO forecast advice text", () => {
    cy.getByQA("forecastClaimAdvice").contains(
      "The Finance Contact can now amend the forecasted costs at any time (as long as the related period's claim has not yet been approved).",
    );
  });

  it("Should show MO specific guidance on cost category values", () => {
    cy.getByQA("forecasts-warning-mo-pm-content").contains(
      "The amount you are requesting differs from the agreed costs for:",
    );
    costCategories.forEach(costCat => {
      cy.getByQA("forecasts-warning-mo-pm-content").within(() => {
        cy.list(costCat);
      });
    });
  });
});
