import { visitApp } from "../../../common/visit";
import { ktpAddPartnerCostCat, navigateToPartnerCosts } from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > KTP > Add a partner > Create PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kTfqTEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("271316");
  });

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should display 'Project costs for new partner' heading", () => {
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should display cost category table", ktpAddPartnerCostCat);
});
