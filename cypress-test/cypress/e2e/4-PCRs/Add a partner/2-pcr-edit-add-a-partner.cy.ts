import { visitApp } from "../../../common/visit";
import { shouldShowProjectTitle, deletePcr, learnOrganisations } from "../steps";

describe("Creating Remove a partner PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
  });

  it("Will click Create request button and proceed to next page", () => {
    cy.submitButton("Create request").click();
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
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

  it("Should have a subheading called 'Project role' and allow radio buttons to be selected", () => {
    cy.get("h2").contains("Project role");
    cy.getByLabel("Collaborator").click();
    cy.getByLabel("Project Lead").click();
  });

  it("Should have a subheading called 'Project outputs' with further information and allow radio buttons to be selected", () => {
    cy.get("h2").contains("Project outputs");
    cy.getByQA("field-isCommercialWork").contains(
      "Will the new partner's work on the project be mostly commercial or economic",
    );
    cy.getByLabel("Yes").click();
    cy.getByLabel("No").click();
    cy.getByLabel("Yes").click();
  });

  it("Should have the subheading 'Organisation type'", () => {
    cy.get("h2").contains("Organisation type");
  });

  it("Should have a 'What are the different types?' expandable section", learnOrganisations);

  it("Should have a contact your MO for information message", () => {
    cy.getByQA("field-partnerType").contains("If the new partner's organisation type is not listed");
  });

  it("Should click the radio buttons to select the organisation type", () => {
    cy.getByLabel("Business").click();
    cy.getByLabel("Research").click();
    cy.getByLabel("Research and Technology Organisation (RTO)").click();
    cy.getByLabel("Public Sector, charity or non Je-S").click();
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", () => {
    cy.submitButton("Save and continue");
    cy.submitButton("Save and return to summary");
  });
});
