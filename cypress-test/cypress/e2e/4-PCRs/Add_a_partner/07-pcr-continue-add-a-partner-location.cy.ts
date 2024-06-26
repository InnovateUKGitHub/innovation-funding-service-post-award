import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  saveContinueSaveSummary,
  navigateToPartnerLocation,
  displayLocationWithGuidance,
  locationRadioButtons,
  townAndPostcodeFields,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR location details section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should navigate to the partner location section", navigateToPartnerLocation);

  it("Should display the 'Project location' heading and guidance text", displayLocationWithGuidance);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should attempt to Save and continue without completing fields to prompt validation", () => {
    cy.clickOn("Save and continue");
    cy.validationLink("Select a project location");
    cy.paragraph("Select a project location.");
  });

  it("Should show radio buttons for 'Inside the UK' and 'Outside of the UK' and click in turn", locationRadioButtons);

  it(
    "Should show the 'Name of town or city' heading and 'Postcode' heading and guidance message",
    townAndPostcodeFields,
  );

  it("Should complete the text boxes for name of town and postcode", () => {
    cy.getByLabel("Name of town or city").type("Swindon");
    cy.getByLabel("Postcode").type("SN5");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
