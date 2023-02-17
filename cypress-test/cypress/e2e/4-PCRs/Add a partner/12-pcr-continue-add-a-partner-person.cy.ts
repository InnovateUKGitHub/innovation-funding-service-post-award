import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, saveContinueSaveSummary, navigateToPartnerPerson } from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR person details section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should navigate to the Add a person page", navigateToPartnerPerson);

  it("Should have 'Add person to organisation' heading with guidance text", () => {
    cy.get("h2").contains("Add person to organisation");
    cy.get("p").contains("This information will be used to create an account");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should have a 'Finance contact' heading", () => {
    cy.get("h2").contains("Finance contact");
  });

  it("Should have field names for First, Last name, Phone number and Email and complete the input boxes", () => {
    cy.getByLabel("First name").type("Joseph");
    cy.getByLabel("Last name").type("Dredd");
    cy.getByLabel("Phone number").type("01234567890");
    cy.getByQA("field-contact1Phone").contains("We may use this to contact the partner");
    cy.getByLabel("Email").type("Joseph.dredd@mc1.comtest");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
