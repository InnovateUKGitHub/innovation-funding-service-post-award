import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  navigateToPartnerCosts,
  pcrNewCostCatLineItem,
  addPartnerCostCat,
  addPartnerLabourGuidance,
  addPartnerWholeDaysOnly,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";
import { deleteCost } from "./add-partner-e2e-steps";

const pm = "james.black@euimeabs.test";

describe("PCR > Add partner > Continuing editing PCR project costs section", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  // after(() => {
  //   cy.deletePcr("328407");
  // });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should display cost category table", addPartnerCostCat);

  it("Should edit the labour value", () => {
    cy.contains("td", "Labour").siblings().contains("a", "Edit").click();
  });

  it("Should display the Labour heading and 'Labour guidance' section", addPartnerLabourGuidance);

  // it("Should contain a table for adding Labour cost items", () => {
  //   cy.wait(1000);
  //   cy.tableHeader("Description");
  //   cy.tableHeader("Cost (£)");
  //   cy.tableHeader("Total labour");
  // });
  //
  // it(
  //   "Should check that only whole numbers can be entered into the days section of the cost category",
  //   addPartnerWholeDaysOnly,
  // );

  //it("Should enter a new cost category line item by navigating to a new page", pcrNewCostCatLineItem);
  //
  //it("Should now display the cost category table which contains the £50,000.00 entered on the previous page", () => {
  //  cy.get("span").contains("Labour guidance");
  //  cy.tableCell("Law keeper");
  //  cy.tableCell("£50,000.00");
  //});
  //
  //it("Should Save and return to project costs", () => {
  //  cy.submitButton("Save and return to project costs").click();
  //});
  //
  //it("Should assert the change to the cost cat table and display £50,000.00 in the total costs", () => {
  //  cy.get("h2").contains("Project costs for new partner");
  //  cy.get("span").contains("£50,000.00");
  //});
  //
  //it("Should access the cost category again and delete the line item", deleteCost);

  it("Should enter many line items", () => {
    for (let i = 1; i < 121; i++) {
      let subtotal = 1332.66 * i;
      let GBPTotal = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      });
      cy.log(`***Adding cost item number ${i}***`);
      cy.wait(500);
      cy.get("a").contains("Add a cost").click();
      cy.getByLabel("Role within project");
      cy.getByLabel("Role within project").type(`Lorem ${i}`);
      cy.wait(500);
      cy.getByLabel("Gross employee cost").type("1000");
      cy.wait(500);
      cy.getByLabel("Rate (£/day)").type("666.33");
      cy.wait(500);
      cy.getByLabel("Days to be spent by all staff with this role").type("2");
      cy.wait(500);
      cy.clickOn("Save and return to labour");
      cy.tableCell(`Lorem ${i}`);
      cy.get("tfoot").within(() => {
        cy.get("tr")
          .eq(1)
          .within(() => {
            cy.get("td:nth-child(2)").contains(GBPTotal.format(subtotal));
          });
      });
    }
  });
});
