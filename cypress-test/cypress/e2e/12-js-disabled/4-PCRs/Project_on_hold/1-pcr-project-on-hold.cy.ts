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
  validateDateRequired,
  validatePartialDate,
  validateFutureStartDate,
} from "../steps";
const projectManager = "james.black@euimeabs.test";

describe("js disabled >PCR >  Put project on hold > Create PCR", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Put project on hold");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Put project on hold PCR", () => {
    cy.createPcr("Put project on hold", { jsDisabled: true });
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
    cy.clickOn("a", "Put project on hold");
  });

  it("Should contain the correct headings and back link", projectOnHoldHeadings);

  it("Should contain guidance on submitting the PCR", () => {
    cy.paragraph("You will not be able to perform any normal activities while this project is on hold");
  });

  it("Should have subheadings for 'first day' and 'last day' of pause", () => {
    ["First day of pause", "Last day of pause (if known)"].forEach(subheading => {
      cy.get("legend").contains(subheading);
    });
  });

  it("Should continue with empty fields onto the next page", () => {
    cy.clickOn("Save and continue");
    cy.backLink("Back to request");
  });

  it("Should mark as complete and attempt to save, prompting validation", () => {
    cy.getByLabel("I agree with this change").click();
    cy.clickOn("Save and return to request");
    cy.validationLink("Enter a valid project suspension start date.");
  });

  it("Should return to editing the request", () => {
    cy.getListItemFromKey("First day of pause", "Edit").click();
    cy.get("legend").contains("First day of pause");
  });

  it("Should enter a valid start date and the validation message should dynamically be removed", () => {
    cy.get("#suspensionStartDate_month").clear().type("12");
    cy.get("#suspensionStartDate_year").clear().type("2024");
    cy.get("#suspensionEndDate_month").clear();
    cy.get("a").each($a => {
      cy.wrap($a).should("not.have.text", "Enter a valid project suspension start date.");
    });
  });

  it("Should validate that numbers and a date are required", validateDateRequired);

  it("Should validate partially populated fields", validatePartialDate);

  it("Should validate a start date that occurs after the end date", validateFutureStartDate);

  it("Should populate the date fields", populateDateFields);

  it("Should click save and continue", () => {
    cy.clickOn("Save and continue");
  });

  it("Should show a summary of the date changes", dateChangeSummary);

  it("Should 'Mark as complete' and continue to 'Save and return to request'", markAsCompleteSave);
});
