import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, deletePcr, navigateToPartnerCosts, pcrNewCostCatLineItem } from "../steps";

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should display 'Project costs for new partner' heading", () => {
    cy.get("h2").contains("Project costs for new partner", { timeout: 10000 });
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should display cost category table", () => {
    cy.tableHeader("Category");
    cy.tableHeader("Cost (£)");
    cy.tableCell("Labour");
    cy.tableCell("Overheads");
    cy.tableCell("Materials");
    cy.tableCell("Capital usage");
    cy.tableCell("Subcontracting");
    cy.tableCell("Travel and subsistence");
    cy.tableCell("Other costs");
    cy.tableCell("Other costs 2");
    cy.tableCell("Other costs 3");
    cy.tableCell("Other costs 4");
    cy.tableCell("Other costs 5");
    cy.tableCell("Total costs (£)");
  });

  it("Should edit the labour value", () => {
    cy.contains("td", "Labour", { timeout: 10000 }).siblings().contains("a", "Edit").click();
  });

  it("Should display the Labour heading and 'Labour guidance' section", () => {
    cy.get("h2").contains("Labour", { timeout: 10000 });
    cy.get("span").contains("Labour guidance", { timeout: 10000 }).click();
    cy.get("p").contains("The new partner will need to account for all labour");
    cy.get("li").contains("gross salary");
    cy.get("li").contains("National Insurance");
    cy.get("li").contains("company pension");
    cy.get("li").contains("life insurance");
    cy.get("li").contains("other non-discretionary package costs");
    cy.get("p").contains("You cannot include:");
    cy.get("li").contains("discretionary bonuses");
    cy.get("li").contains("performance related payments");
    cy.get("p").contains("You may include the total number");
    cy.get("li").contains("sick days");
    cy.get("li").contains("waiting time");
    cy.get("li").contains("training days");
    cy.get("li").contains("non-productive time");
    cy.get("p").contains("List the total days worked");
    cy.get("p").contains("We will review the total");
  });

  it("Should contain a table for adding Labour cost items", () => {
    cy.wait(5000);
    cy.tableHeader("Description");
    cy.tableHeader("Cost (£)");
    cy.tableHeader("Total labour");
  });

  it("Should enter a new cost category line item by navigating to a new page", pcrNewCostCatLineItem);

  it("Should now display the cost category table which contains the £50,000.00 entered on the previous page", () => {
    cy.get("span").contains("Labour guidance", { timeout: 10000 });
    cy.tableCell("Law keeper");
    cy.tableCell("£50,000.00");
  });

  it("Should Save and return to project costs", () => {
    cy.submitButton("Save and return to project costs").click();
  });

  it("Should assert the change to the cost cat table and display £50,000.00 in the total costs", () => {
    cy.get("h2").contains("Project costs for new partner", { timeout: 10000 });
    cy.get("span").contains("£50,000.00", { timeout: 10000 });
  });

  it("Should have a 'Save and continue' button and 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });
});
