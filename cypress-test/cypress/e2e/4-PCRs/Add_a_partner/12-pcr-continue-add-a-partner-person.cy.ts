import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  navigateToPartnerPerson,
  validateAddPerson,
  clearAndEnterValidPersonInfo,
} from "../steps";
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
    cy.paragraph("This information will be used to create an account");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should have a 'Finance contact' heading", () => {
    cy.get("h2").contains("Finance contact");
  });

  it("Should check for validation messaging while entering invalid details", validateAddPerson);

  it(
    "Should clear the previous data and enter a valid First & Last name, Phone number and Email",
    clearAndEnterValidPersonInfo,
  );

  it("With valid data, it should now 'Save and continue' and then assert the next page loads correctly", () => {
    cy.get("button").contains("Save and continue").click();
    cy.get("h2").contains("Project costs for new partner");
  });
});
