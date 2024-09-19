import { visitApp } from "common/visit";
import { costCategories, displayClosedClaimSummary } from "./steps";

describe("claims > FC view of closed claim", () => {
  before(() => {
    visitApp({ asUser: "contact77@test.co.uk" });
    cy.navigateToProject("879546");
    cy.selectTile("Claims");
  });

  it('should navigate to the view claim page for the closed claim when the "view" link is clicked', () => {
    cy.get("h2").contains("Closed");
    cy.get("td").contains("View").click();
    cy.get("h2").contains("A B Cad Services claim for period 1");
  });

  it("Should display a claim summary at the top of the page", displayClosedClaimSummary);

  it("should have a claim table with all the cost categories", () => {
    costCategories.forEach(cat => cy.getTableRow(cat));
  });

  it("should show the correct value for costs claimed this period for Labour", () => {
    const tests = [
      ["Costs claimed this period", "Labour", "£42,400.00"],
      ["Remaining eligible costs", "Labour", "£7,600.00"],
      ["Costs claimed this period", "Materials", "£5,000.00"],
      ["Remaining eligible costs", "Materials", "£15,000.00"],
      ["Costs claimed this period", "Subcontracting", "£12,000.00"],
      ["Remaining eligible costs", "Subcontracting", "£0.00"],
      ["Costs claimed this period", "Total", "£59,400.00"],
      ["Remaining eligible costs", "Total", "£22,600.00"],
    ] as const;

    tests.forEach(([column, row, value]) => {
      cy.getCellFromHeaderAndRow(column, row).should("have.text", value);
    });
  });

  it("should show the expected status and comments log", () => {
    cy.clickOn("Status and comments log");
    cy.getCellFromHeaderAndRow("Status update", "Payment being processed");
    cy.getCellFromHeaderAndRow("Status update", "Submitted to Innovate UK");
    cy.getCellFromHeaderAndRow("Status update", "Submitted to Monitoring Officer");
  });

  it("should navigate to the correct cost category details when the table element is clicked", () => {
    cy.clickOn("table tr td a", "Labour");
    cy.heading("Labour");
  });

  it("should show the expected details", () => {
    cy.getCellFromHeaderAndRow("Cost", "Labour").should("have.text", "£42,400.00");
    cy.getTableRow("Total costs").contains("£42,400.00");
    cy.getTableRow("Forecast costs").contains("£0.00");
    cy.getTableRow("Difference").contains("0.00%");
  });

  it("should show the expected uploaded supporting documents", () => {
    cy.contains("No documents uploaded");
  });

  it("should have navigation arrows indicating subcontracting and materials", () => {
    cy.contains("Previous").contains("Subcontracting");
    cy.contains("Next").contains("Materials");
  });

  it("should navigate to the materials page when Next > Materials is clicked", () => {
    cy.contains("Next").contains("Materials").click();
    cy.heading("Materials");
    cy.getCellFromHeaderAndRow("Cost", "Gubbins").should("have.text", "£5,000.00");
    cy.getTableRow("Total costs").contains("£5,000.00");
    cy.getTableRow("Forecast costs").contains("£0.00");
    cy.getTableRow("Difference").contains("0.00%");
  });

  it("should navigate back to the labour page when Previous > Labour is clicked", () => {
    cy.contains("Previous").contains("Labour").click();
    cy.heading("Labour");
  });

  it("should navigate back to the subcontracting page when Previous > Subcontracting is clicked", () => {
    cy.contains("Previous").contains("Subcontracting").click();
    cy.heading("Subcontracting");
    cy.getCellFromHeaderAndRow("Cost", "Palming off work to 3rd party").should("have.text", "£12,000.00");
    cy.getTableRow("Total costs").contains("£12,000.00");
    cy.getTableRow("Forecast costs").contains("£0.00");
    cy.getTableRow("Difference").contains("0.00%");
  });
});
