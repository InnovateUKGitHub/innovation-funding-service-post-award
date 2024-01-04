import { visitApp } from "common/visit";

describe("claims > No open claims, no closed claims", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("834016");
  });

  it("Should select the Claims tile", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
  });

  it("Should show correct guidance information", () => {
    cy.paragraph(
      "All partners in this project must upload evidence for each expenditure with every claim made. These might include invoices, timesheets, receipts or spreadsheets for capital usage.",
    );
  });

  it("Should show info on when the next claim period opens under the 'Open' section", () => {
    cy.getByQA("notificationMessage").contains("There are no open claims. The next claim period begins ");
  });

  it("Should show no closed claims beneath the closed section", () => {
    for (let i = 0; i < 1; i++) {
      cy.get(`#accordion-default-content-accordion-item-${i}`).contains("There are no closed claims for this partner.");
    }
  });
});
