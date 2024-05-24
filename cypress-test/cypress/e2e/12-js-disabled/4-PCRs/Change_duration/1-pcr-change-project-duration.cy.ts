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
  validatePcrDurationPage,
} from "../steps";
const projectManager = "james.black@euimeabs.test";

describe("js disabled > PCR >  Change project duration > Create PCR", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Change project duration");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  after(() => {
    // cy.deletePcr("328407");
  });

  it("Should display the create PCR heading", () => {
    cy.heading("Start a new request");
  });

  it("Should create a Change project duration PCR", () => {
    cy.createPcr("Change project duration", { jsDisabled: true });
  });

  it("Should display the request heading", () => {
    cy.heading("Request");
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

  it("Should attempt to submit and trigger validation messaging", validatePcrDurationPage);

  it("Should click 'Change project duration' and continue", () => {
    cy.clickOn("a", "Change project duration");
  });

  it("Should contain the PCR title, correct project title and back button", changeDurationHeadings);

  it("Should contain guidance information", () => {
    cy.paragraph("Use this page to request an extension or reduction to your");
    cy.paragraph("Select the new project end date you require.");
  });

  it("Should contain existing project details heading and information", existingProjectDetails);

  it("Should contain Proposed project details", () => {
    cy.get("legend").contains("Proposed project details");
    cy.getByLabel("Please select a new date from the available list");
  });

  it("Should attempt to 'Save and continue' with the current end date and prompt error message", () => {
    cy.clickOn("Save and continue");
    cy.getByLabel("I agree with this change").click();
    cy.clickOn("Save and return to request");
    cy.getByQA("validation-summary").contains(
      "You must either increase or decrease the project duration. You cannot select your current end date.",
    );
  });

  it("Should deselect I agree with this change and re-access the PCR", () => {
    cy.getByLabel("I agree with this change").click();
    cy.clickOn("a", "Edit");
    cy.heading("Change project duration");
  });

  it("Should select December 2025 from the dropdown box", selectDateDropdown);

  it("Should then click 'Save and continue' to proceed to the summary page", () => {
    cy.clickOn("Save and continue");
    cy.getByLabel("I agree with this change.");
  });

  it("Should again contain the PCR title, correct project title and back button", changeDurationHeadings);

  it("Should show 'Existing' subheadings from the previous page and display a summary", existingSubheadings);

  it("Should show 'Proposed' subheadings from the previous page and display a summary", proposedSubheadings);

  it("Should mark as complete and then click 'Save and return to request'", markAsCompleteSave);

  it("Should display the status of the Change project duration PCR as 'Complete'", () => {
    cy.heading("Request");
    cy.get("strong").contains("Complete");
  });

  it("Should re-access the PCR and assert that the tick box is populated", () => {
    cy.clickOn("a", "Change project duration");
    cy.heading("Change project duration");
    cy.get("#marked-as-complete").should("be.checked");
  });
});
