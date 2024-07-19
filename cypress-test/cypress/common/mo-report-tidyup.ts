import { startNewReportButton } from "e2e/6-mo-reports/steps";

export const moReportTidyup = (report: string) => {
  cy.get("main").within(() => {
    cy.get("table").then($table => {
      if ($table.text().includes(report)) {
        cy.log(`Deleting existing ${report} MO Report`);
        cy.tableCell(report).siblings().contains("a", "Delete report").click({ force: true });
        cy.submitButton("Delete report").click();
        startNewReportButton;
      } else {
        startNewReportButton;
      }
    });
  });
};
