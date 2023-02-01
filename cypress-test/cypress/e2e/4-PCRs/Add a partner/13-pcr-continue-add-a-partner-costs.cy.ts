import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  deletePcr,
  navigateToPartnerCosts,
  pcrNewCostCatLineItem,
  addPartnerCostCat,
  addPartnerLabourGuidance,
  addPartnerLabourCost,
} from "../steps";

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should display 'Project costs for new partner' heading", () => {
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should display cost category table", addPartnerCostCat);

  it("Should edit the labour value", () => {
    cy.contains("td", "Labour").siblings().contains("a", "Edit").click();
  });

  it("Should display the Labour heading and 'Labour guidance' section", addPartnerLabourGuidance);

  it("Should contain a table for adding Labour cost items", addPartnerLabourCost);

  it("Should enter a new cost category line item by navigating to a new page", pcrNewCostCatLineItem);

  it(
    "Should now display the cost category table which contains the £50,000.00 entered on the previous page",
    addPartnerLabourGuidance,
  );

  it("Should Save and return to project costs", () => {
    cy.submitButton("Save and return to project costs").click();
  });

  it("Should assert the change to the cost cat table and display £50,000.00 in the total costs", () => {
    cy.get("h2").contains("Project costs for new partner");
    cy.get("span").contains("£50,000.00");
  });

  it("Should have a 'Save and continue' button and 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });
});
