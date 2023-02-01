import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  deletePcr,
  saveContinueSaveSummary,
  navigateToPartnerLocation,
  addPartnerLocation,
} from "../steps";

describe("PCR > Add partner > Continuing editing PCR location details section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should navigate to the partner location section", navigateToPartnerLocation);

  it("Should display the 'Project location' heading and guidance text", () => {
    cy.get("h2").contains("Project location");
    cy.getByQA("field-projectLocation").contains("Indicate where the majority");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.get("h1").contains("Add a partner");
  });

  it("Should show radio buttons for 'Inside the UK' and 'Outside of the UK' and click in turn", () => {
    cy.get("#projectLocation_10").click();
    cy.get("#projectLocation_20").click();
    cy.get("#projectLocation_10").click();
  });

  it(
    "Should show the 'Name of town or city' heading and 'Postcode, Postal code or zip code' heading and guidance message",
    addPartnerLocation,
  );

  it("Should complete the text boxes for name of town and postcode", () => {
    cy.get("#projectCity").type("Swindon");
    cy.get("#projectPostcode").type("SN5");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
