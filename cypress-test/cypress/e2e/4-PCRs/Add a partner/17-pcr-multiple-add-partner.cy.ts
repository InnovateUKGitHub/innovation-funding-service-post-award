import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { PcrItemType, completeAddPartnerForMulti, multiPcrArray, navigateToPartnerCosts } from "../steps";

describe("PCR > Multiple add partner", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create an Add partner PCR", () => {
    cy.clickCheckBox(PcrItemType.AddAPartner);
    cy.submitButton("Create request").click();
    cy.get("h1").contains("Request", { timeout: 60000 });
  });

  it("Should add another Add partner PCR", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
    cy.clickCheckBox(PcrItemType.AddAPartner);
    cy.submitButton("Add to request").click();
    cy.get("h1").contains("Request", { timeout: 60000 });
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
  });

  it("Should navigate to the 'Project costs for new partner' page", completeAddPartnerForMulti);
});
