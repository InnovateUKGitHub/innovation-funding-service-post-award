import { visitApp } from "common/visit";
import { accessCostCat, documentsScreenCopy, forecastScreenCopy, summaryPageCopy } from "./steps";

const fc = "contact77@test.co.uk";

describe("Internal Assurance > claims copy", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("770699");
  });

  it("Should navigate to the claims tile", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
  });

  it("Should access the draft claim", () => {
    cy.get("a").contains("Edit").click();
    cy.heading("Costs to be claimed");
  });

  it("Should access each cost category and assert for correct copy", () => {
    [
      "Labour",
      "Overheads",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
    ].forEach(costCat => {
      accessCostCat(costCat);
    });
  });

  it("Should continue to documents screen and assert for correct copy", documentsScreenCopy);

  it("Should continue to the claim forecast screen and generate overspend triggering correct copy", forecastScreenCopy);

  it("Should continue to summary page and check for correct copy", summaryPageCopy);
});
