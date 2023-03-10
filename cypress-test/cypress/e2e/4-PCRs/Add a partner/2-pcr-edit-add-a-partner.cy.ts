import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  learnOrganisations,
  clickCreateRequestButtonProceed,
  projectOutputs,
  organisationRadios,
  saveContinueSaveSummary,
  projectRoleRadios,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Edit PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'New partner information' heading", () => {
    cy.get("h1").contains("Add a partner");
    cy.get("h2").contains("New partner information");
  });

  it("Should have a validation message stating 'You cannot change this information...", () => {
    cy.getByQA("validation-message-content").contains("You cannot change this information after you continue.");
  });

  it("Should have a subheading called 'Project role' and allow radio buttons to be selected", projectRoleRadios);

  it(
    "Should have a subheading called 'Project outputs' with further information and allow radio buttons to be selected",
    projectOutputs,
  );

  it("Should have the subheading 'Organisation type'", () => {
    cy.get("h2").contains("Organisation type");
  });

  it("Should have a 'What are the different types?' expandable section", learnOrganisations);

  it("Should have a contact your MO for information message", () => {
    cy.getByQA("field-partnerType").contains("If the new partner's organisation type is not listed");
  });

  it("Should click the radio buttons to select the organisation type", organisationRadios);

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
