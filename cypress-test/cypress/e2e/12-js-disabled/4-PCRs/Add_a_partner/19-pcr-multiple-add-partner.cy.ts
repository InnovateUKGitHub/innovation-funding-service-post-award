import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { PcrItemType, completeAddPartnerForMulti } from "../steps";

const pm = "james.black@euimeabs.test";

describe("PCR > Multiple add partner", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should create an Add partner PCR", () => {
    cy.clickCheckBox(PcrItemType.AddAPartner);
    cy.clickOn("Create request");
    cy.get("h1").contains("Request", { timeout: 60000 });
  });

  it("Should add another Add partner PCR", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
    cy.clickCheckBox(PcrItemType.AddAPartner);
    cy.clickOn("Add to request");
    cy.get("h1").contains("Request", { timeout: 60000 });
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
  });

  it("Should navigate to the 'Project costs for new partner' page", completeAddPartnerForMulti);
});
