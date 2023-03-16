import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  shouldShowProjectTitle,
  requestHeadingDetailsHeading,
  changeDurationPcrType,
  changeDurationHeadings,
  existingProjectDetails,
  selectDateDropdown,
  existingSubheadings,
  proposedSubheadings,
  markAsCompleteSave,
} from "../steps";
const projectManager = "james.black@euimeabs.test";

describe("PCR >  Change project duration > Create PCR", () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Change project duration");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select the correct tick box and start a new 'Change project duration' PCR", () => {
    cy.clickCheckBox("Change project duration");
    cy.getByQA("button_default-qa").contains("Create request").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type and continue to begin the PCR", changeDurationPcrType);

  it("Should click 'Change project duration' and continue", () => {
    cy.get("a").contains("Change project duration").click();
  });

  it("Should contain the PCR title, correct project title and back button", changeDurationHeadings);

  it("Should contain guidance information", () => {
    cy.get("p").contains("Use this page to request an extension or reduction to your");
    cy.get("p").contains("Select the new project end date you require.");
  });

  it("Should contain existing project details heading and information", existingProjectDetails);

  it("Should contain Proposed project details", () => {
    cy.get("h2").contains("Proposed project details");
    cy.getByLabel("Please select a new date from the available list");
  });

  it("Should select March 2024 from the dropdown box", selectDateDropdown);

  it("Should then click 'Save and continue' to proceed to the summary page", () => {
    cy.getByQA("button_default-qa").contains("Save and continue").click();
    cy.getByLabel("I agree with this change.");
  });

  it("Should again contain the PCR title, correct project title and back button", changeDurationHeadings);

  it("Should show 'Existing' subheadings from the previous page and display a summary", existingSubheadings);

  it("Should show 'Proposed' subheadings from the previous page and display a summary", proposedSubheadings);

  it("Should mark as complete and then click 'Save and return to request'", markAsCompleteSave);
});
