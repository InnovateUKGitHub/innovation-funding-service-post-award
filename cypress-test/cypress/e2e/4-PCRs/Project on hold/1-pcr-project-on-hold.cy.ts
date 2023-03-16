import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  shouldShowProjectTitle,
  requestHeadingDetailsHeading,
  projectOnHoldPcrType,
  projectOnHoldHeadings,
  populateDateFields,
  dateChangeSummary,
  markAsCompleteSave,
} from "../steps";
const projectManager = "james.black@euimeabs.test";

describe("PCR >  Put project on hold > Create PCR", () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Put project on hold");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select the correct tick box and start a new 'Change project duration' PCR", () => {
    cy.clickCheckBox("Put project on hold");
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

  it("Should show the correct PCR type and continue to begin the PCR", projectOnHoldPcrType);

  it("Should click 'Put project on hold' and continue", () => {
    cy.get("a").contains("Put project on hold").click();
  });

  it("Should contain the correct headings and back link", projectOnHoldHeadings);

  it("Should contain guidance on submitting the PCR", () => {
    cy.get("p").contains("You will not be able to perform any normal activities while this project is on hold");
  });

  it("Should have subheadings for 'first day' and 'last day' of pause", () => {
    ["First day of pause", "Last day of pause (if known)"].forEach(subheading => {
      cy.get("h2").contains(subheading);
    });
  });

  it("Should populate the date fields", populateDateFields);

  it("Should click save and continue", () => {
    cy.getByQA("button_default-qa").contains("Save and continue").click();
  });

  it("Should show a summary of the date changes", dateChangeSummary);

  it("Should 'Mark as complete' and continue to 'Save and return to request'", markAsCompleteSave);
});
