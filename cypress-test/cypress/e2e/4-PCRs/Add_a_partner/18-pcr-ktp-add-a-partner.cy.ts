import { visitApp } from "../../../common/visit";
import { ktpAddPartnerCostCat } from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";
import { collaboratorAndBusiness, navigateToPartnerCosts } from "./add-partner-e2e-steps";

describe("PCR > KTP > Add a partner > Create PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kTfqTEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("271316");
  });

  it("Should create an add partner PCR and access Add a partner", () => {
    cy.createPcr("Add a partner");
    cy.get("a").contains("Add a partner").click();
    cy.heading("Add a partner");
  });

  it("Should complete as a collaborator and business", collaboratorAndBusiness);

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should display 'Project costs for new partner' heading", () => {
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should display cost category table", ktpAddPartnerCostCat);
});
