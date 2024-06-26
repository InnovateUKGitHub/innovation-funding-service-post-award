import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { shouldShowProjectTitle, addPartnerCostCat } from "../steps";

import {
  checkAddLabourItem,
  checkAddMaterialsItem,
  checkAddOverheadItem,
  checkAddCapitalUsageItem,
  checkAddSubcontractingItem,
  checkAddTravelAndSubsistenceItem,
  checkAddOtherCostsItem,
  checkAddAdditionalLabourItem,
  checkAddAdditionalMaterialsItem,
  checkAddAdditionalCapitalUsageItem,
  checkAddAdditionalSubcontractingItem,
  checkAddAdditionalTravelAndSubsistenceItem,
  checkAddAdditionalOtherCostsItem,
  checkEditLabourItem,
  checkEditOverheads,
  checkEditMaterialsItem,
  checkEditCapitalUsageItem,
  checkEditSubcontractingItem,
  checkEditTravelAndSubsistenceItem,
  checkEditOtherCostsItem,
  checkDeleteLabourItem,
  checkDeleteMaterialsItem,
  checkDeleteCapitalUsageItem,
  checkDeleteSubcontractingItem,
  checkDeleteTravelAndSubsistenceItem,
  checkDeleteOtherCostsItem,
  costsInCorrectOrder,
} from "./costs-steps";

import { addManyLines, collaboratorAndBusiness, deleteCost, navigateToPartnerCosts } from "./add-partner-e2e-steps";

const pm = "james.black@euimeabs.test";

/**
 * Test process
 * 1 - go through each cost, test validations, add a cost, return to summary, check cost total and running total of totals
 * 2 - go through each cost, adding a second cost, returning and checking totals
 * 3 - go through each cost, editing a cost, returning, and checking totals
 * 4 - go through each cost, deleting a cost, returning and checking totals.
 * 5 - delete the pcr
 * 6 - test large cases
 */

describe("PCR > Add Partner > Business Costs", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create an add partner PCR and access Add a partner", () => {
    cy.createPcr("Add a partner");
    cy.get("a").contains("Add a partner").click();
    cy.heading("Add a partner");
  });

  it("Should complete as a collaborator and business", collaboratorAndBusiness);

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it('should show the "Project costs for new partner" header and the cost categories', () => {
    shouldShowProjectTitle();
    addPartnerCostCat();
  });

  /**
   * 1. Go through each cost, testing validations, adding a cost, returning to summary and check running totals
   */

  it("should add a labour item", checkAddLabourItem);
  it("should add an overhead item", checkAddOverheadItem);
  it("should add a materials item", checkAddMaterialsItem);
  it("should add a capital usage item", checkAddCapitalUsageItem);
  it("should add a subcontracting item", checkAddSubcontractingItem);
  it("should add a travel and subsistence item", checkAddTravelAndSubsistenceItem);
  it("should add an other costs 1 item", () => checkAddOtherCostsItem("1"));
  it("should add an other costs 2 item", () => checkAddOtherCostsItem("2"));
  it("should add an other costs 3 item", () => checkAddOtherCostsItem("3"));
  it("should add an other costs 4 item", () => checkAddOtherCostsItem("4"));
  it("should add an other costs 5 item", () => checkAddOtherCostsItem("5"));

  /**
   * 2. Go through each cost,  adding an additional cost, returning to summary and check running totals
   */

  it("should add an additional labour item", checkAddAdditionalLabourItem);
  it("should add an additional materials item", checkAddAdditionalMaterialsItem);
  it("should add an additional capital usage item", checkAddAdditionalCapitalUsageItem);
  it("should add an additional subcontracting item", checkAddAdditionalSubcontractingItem);
  it("should add an additional travel and subsistence item", checkAddAdditionalTravelAndSubsistenceItem);
  it("should add an additional other costs 1 item", () => checkAddAdditionalOtherCostsItem("1"));
  it("should add an additional other costs 2 item", () => checkAddAdditionalOtherCostsItem("2"));
  it("should add an additional other costs 3 item", () => checkAddAdditionalOtherCostsItem("3"));
  it("should add an additional other costs 4 item", () => checkAddAdditionalOtherCostsItem("4"));
  it("should add an additional other costs 5 item", () => checkAddAdditionalOtherCostsItem("5"));

  /**
   * 3. Go through each cost,  editing a cost, returning to summary and check running totals
   */

  it("should edit a labour item", checkEditLabourItem);
  it("should edit the overheads", checkEditOverheads);
  it("should edit a materials item", checkEditMaterialsItem);
  it("should edit a capital usage item", checkEditCapitalUsageItem);
  it("should edit a subcontracting item", checkEditSubcontractingItem);
  it("should edit a travel and subsistence item", checkEditTravelAndSubsistenceItem);
  it("should edit an other costs 1 item", () => checkEditOtherCostsItem("1"));
  it("should edit an other costs 2 item", () => checkEditOtherCostsItem("2"));
  it("should edit an other costs 3 item", () => checkEditOtherCostsItem("3"));
  it("should edit an other costs 4 item", () => checkEditOtherCostsItem("4"));
  it("should edit an other costs 5 item", () => checkEditOtherCostsItem("5"));

  /**
   * 4. Go through each cost,  deleting a cost, returning to summary and check running totals
   */

  it("should delete a labour item", checkDeleteLabourItem);
  it("should delete a materials item", checkDeleteMaterialsItem);
  it("should delete a capital usage item", checkDeleteCapitalUsageItem);
  it("should delete a subcontracting item", checkDeleteSubcontractingItem);
  it("should delete a travel and subsistence item", checkDeleteTravelAndSubsistenceItem);
  it("should delete an other costs 1 item", () => checkDeleteOtherCostsItem("1"));
  it("should delete an other costs 2 item", () => checkDeleteOtherCostsItem("2"));
  it("should delete an other costs 3 item", () => checkDeleteOtherCostsItem("3"));
  it("should delete an other costs 4 item", () => checkDeleteOtherCostsItem("4"));
  it("should delete an other costs 5 item", () => checkDeleteOtherCostsItem("5"));

  it("Should access the cost category again and delete the line item", deleteCost);

  it("Should enter 20 line items", addManyLines);

  it("should display 20 costs ordered by created date", costsInCorrectOrder);
});
