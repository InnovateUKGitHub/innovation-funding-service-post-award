import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import { correctPcrType } from "../steps";
import {
  completeCapUsageForm,
  completeLabourForm,
  completeMaterialsForm,
  completeOtherCostsForm,
  completeOverheadsSection,
  completeSubcontractingForm,
  completeTandSForm,
  completedCostCatProfiles,
  navigateToCostCat,
} from "./add-partner-e2e-steps";
import {
  addAnotherAddPartner,
  completePCR,
  displayTwoAddPartnerPCRs,
  navToAddPartnerPcrSpendProf,
} from "./multi-add-partner-steps";
const pm = "james.black@euimeabs.test";

describe("PCRs > Add a partner > Multi-Add partner spend profiles", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner", { jsDisabled: true });
  });

  it("Should show the correct PCR type", correctPcrType);

  it("Should add another Add partner PCR", addAnotherAddPartner);

  it("Should now show two Add partner PCRs in the Types section", () => {
    cy.getByQA("typesRow").find("dd").should("have.length", 2);
    cy.getListItemFromKey("Types", "Add a partner");
  });

  it("Should should show two Add a partner PCRs in the Give us information section", displayTwoAddPartnerPCRs);

  /**
   * Accessing first Add partner PCR and completing Spend profile
   */
  it("Should complete the first PCR up to the spend profile", () => navToAddPartnerPcrSpendProf(0));
  it("Should access the Labour section", () => navigateToCostCat("Labour", 1));
  it("Should complete the Labour form", completeLabourForm);
  it("Should access the Overheads section", () => navigateToCostCat("Overheads", 2));
  it("Should complete the section as 20% overhead rate", completeOverheadsSection);
  it("Should access the Materials section", () => navigateToCostCat("Materials", 3));
  it("Should complete the Materials form", completeMaterialsForm);
  it("Should access the Capital usage section", () => navigateToCostCat("Capital usage", 4));
  it("Should complete the Capital usage form", completeCapUsageForm);
  it("Should access the Subcontracting section", () => navigateToCostCat("Subcontracting", 5));
  it("Should complete the form for Subcontracting", completeSubcontractingForm);
  it("Should access the Travel and subsistence section", () => navigateToCostCat("Travel and subsistence", 6));
  it("Should complete the Travel and subsistence form", completeTandSForm);
  it("Should access the Other costs section", () => navigateToCostCat("Other costs", 7));
  it("Should complete the Other costs form", () => completeOtherCostsForm(""));
  it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 2", 8));
  it("Should complete the Other costs 2 section", () => completeOtherCostsForm(" 2"));
  it("Should access the Other costs 3 section", () => navigateToCostCat("Other costs 3", 9));
  it("Should complete the Other costs 3 section", () => completeOtherCostsForm(" 3"));
  it("Should access the Other costs 4 section", () => navigateToCostCat("Other costs 4", 10));
  it("Should complete the Other costs 4 section", () => completeOtherCostsForm(" 4"));
  it("Should access the Other costs 5 section", () => navigateToCostCat("Other costs 5", 11));
  it("Should complete the Other costs 5 section", () => completeOtherCostsForm(" 5"));
  it("Should show a completed table of cost categories with appropriate costs and total", completedCostCatProfiles);
  it("Should continue to complete the PCR", () => completePCR(0));

  /**
   * Access second Add partner PCR and completing spend profile
   */
  it("Should complete the second PCR up to the spend profile", () => navToAddPartnerPcrSpendProf(1));
  it("Should access the Labour section", () => navigateToCostCat("Labour", 1));
  it("Should complete the Labour form", completeLabourForm);
  it("Should access the Overheads section", () => navigateToCostCat("Overheads", 2));
  it("Should complete the section as 20% overhead rate", completeOverheadsSection);
  it("Should access the Materials section", () => navigateToCostCat("Materials", 3));
  it("Should complete the Materials form", completeMaterialsForm);
  it("Should access the Capital usage section", () => navigateToCostCat("Capital usage", 4));
  it("Should complete the Capital usage form", completeCapUsageForm);
  it("Should access the Subcontracting section", () => navigateToCostCat("Subcontracting", 5));
  it("Should complete the form for Subcontracting", completeSubcontractingForm);
  it("Should access the Travel and subsistence section", () => navigateToCostCat("Travel and subsistence", 6));
  it("Should complete the Travel and subsistence form", completeTandSForm);
  it("Should access the Other costs section", () => navigateToCostCat("Other costs", 7));
  it("Should complete the Other costs form", () => completeOtherCostsForm(""));
  it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 2", 8));
  it("Should complete the Other costs 2 section", () => completeOtherCostsForm(" 2"));
  it("Should access the Other costs 3 section", () => navigateToCostCat("Other costs 3", 9));
  it("Should complete the Other costs 3 section", () => completeOtherCostsForm(" 3"));
  it("Should access the Other costs 4 section", () => navigateToCostCat("Other costs 4", 10));
  it("Should complete the Other costs 4 section", () => completeOtherCostsForm(" 4"));
  it("Should access the Other costs 5 section", () => navigateToCostCat("Other costs 5", 11));
  it("Should complete the Other costs 5 section", () => completeOtherCostsForm(" 5"));
  it("Should show a completed table of cost categories with appropriate costs and total", completedCostCatProfiles);
  it("Should continue to complete the PCR", () => completePCR(1));
});
