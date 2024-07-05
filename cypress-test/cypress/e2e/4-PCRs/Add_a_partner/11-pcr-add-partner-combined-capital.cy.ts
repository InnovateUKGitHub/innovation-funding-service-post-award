import { visitApp } from "common/visit";
import { collaboratorAndBusiness } from "./add-partner-e2e-steps";
import { combinedCapitalAddPartnerCostCat, shouldShowProjectTitle } from "../steps";
import {
  accessCcCostCat,
  accessCcProjectNavToPcr,
  addCcCostCatItem,
  checkCcAddPartnerCompleteCosts,
  correctPcrTypes,
  deleteLabourRemoveOH,
  updateLabourCheckOH,
  updateOverheadsCalculated,
} from "./combined-capital-steps";

const pm = "james.black@euimeabs.test";

describe("PCR > Add Partner > Combined Capital", () => {
  before(() => {
    visitApp({ asUser: pm });
  });
  after(() => {
    cy.deletePcr("401856");
  });

  it("Should access Combined Capital project and navigate to PCRs tile", accessCcProjectNavToPcr);

  it("Should check the correct PCR types are listed", correctPcrTypes);

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner");
  });

  it("Should access the add partner PCR and complete as collaborator and business", () => {
    cy.get("a").contains("Add a partner").click();
    cy.heading("Add a partner");
    collaboratorAndBusiness();
  });

  it("Should navigate to the 'Project costs for new partner' page", () => {
    cy.getListItemFromKey("Project costs for new partner", "Edit").click();
    cy.get("h2").contains("Project costs for new partner");
  });

  it('should show the "Project costs for new partner" header and the cost categories', () => {
    shouldShowProjectTitle();
    combinedCapitalAddPartnerCostCat();
  });

  /**
  Form types for completing cost cat line items are as follows:
  labour
  overheads
  materials
  subcontracting
  travelAndSub
  capusage
  otherCosts
 */
  it("Should access R & D labour cost category and complete.", () => {
    accessCcCostCat("R & D labour");
    addCcCostCatItem("R & D labour", "labour");
  });

  it("Should access R & D overheads and complete.", () => {
    accessCcCostCat("R & D overheads");
    addCcCostCatItem("R & D overheads", "overheads");
  });

  it("Should access R & D materials and complete.", () => {
    accessCcCostCat("R & D materials");
    addCcCostCatItem("R & D materials", "materials");
  });

  it("Should access R & D subcontracting and complete.", () => {
    accessCcCostCat("R & D subcontracting");
    addCcCostCatItem("R & D subcontracting", "subcontracting");
  });

  it("Should access R & D travel and subsistence and complete", () => {
    accessCcCostCat("R & D travel and subsistence");
    addCcCostCatItem("R & D travel and subsistence", "travelAndSub");
  });

  it("Should access R & D capital usage and complete.", () => {
    accessCcCostCat("R & D capital usage");
    addCcCostCatItem("R & D capital usage", "capusage");
  });

  it("Should access R & D other costs and complete", () => {
    accessCcCostCat("R & D other costs");
    addCcCostCatItem("R & D other costs", "otherCosts");
  });

  it("Should access Capital purchase (inf) and complete", () => {
    accessCcCostCat("Capital purchase (inf)");
    addCcCostCatItem("Capital purchase (inf)", "otherCosts");
  });

  it("Should access Property capital costs (inf) and complete", () => {
    accessCcCostCat("Property capital costs (inf)");
    addCcCostCatItem("Property capital costs (inf)", "otherCosts");
  });

  it("Should access Other capital costs (other) and complete", () => {
    accessCcCostCat("Other capital costs (other)");
    addCcCostCatItem("Other capital costs (other)", "otherCosts");
  });

  it("Should access Capitalised labour (inf) and complete", () => {
    accessCcCostCat("Capitalised labour (inf)");
    addCcCostCatItem("Capitalised labour (inf)", "otherCosts");
  });

  it("Should access Property capital costs (other) and complete.", () => {
    accessCcCostCat("Property capital costs (other)");
    addCcCostCatItem("Property capital costs (other)", "otherCosts");
  });

  it("Should access Other capital costs (inf) and complete", () => {
    accessCcCostCat("Other capital costs (inf)");
    addCcCostCatItem("Other capital costs (inf)", "otherCosts");
  });

  it("Should access Capital purchase (other) and complete.", () => {
    accessCcCostCat("Capital purchase (other)");
    addCcCostCatItem("Capital purchase (other)", "otherCosts");
  });

  it("Should access Capitalised labour (other) and complete.", () => {
    accessCcCostCat("Capitalised labour (other)");
    addCcCostCatItem("Capitalised labour (other)", "otherCosts");
  });

  it("Should check the cost categories are all saved with correct total", checkCcAddPartnerCompleteCosts);

  it("Should re-access labour and edit the cost ensuring overheads are reflected with the change", updateLabourCheckOH);

  it("Should access Overheads and change it to calculated instead of 20%", updateOverheadsCalculated);

  it("Should re-access labour and delete the cost line item which should also remove Overheads", deleteLabourRemoveOH);
});
