import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  deletePcr,
  saveContinueSaveSummary,
  navigateToPartnerPerson,
  fieldNameInputs,
} from "../steps";

describe("PCR > Add partner > Continuing editing PCR person details section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
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

  it(
    "Should have field names for First, Last name, Phone number and Email and complete the input boxes",
    fieldNameInputs,
  );

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
