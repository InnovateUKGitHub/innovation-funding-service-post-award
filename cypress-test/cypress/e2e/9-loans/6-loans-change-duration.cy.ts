import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../common/visit";
import {
  currentLoanTable,
  loanDurationGuidance,
  markAndReturn,
  newLoanDurationTable,
  updatedLoansTable,
} from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("Loans project > Change Loans Duration", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
    pcrTidyUp("Change Loans Duration");
  });

  after(() => {
    cy.deletePcr("191431");
  });

  it("Should click the 'Change Loans Duration' checkbox and create the PCR", () => {
    cy.createPcr("Change Loans Duration");
  });

  it("Should load the 'Request' page", () => {
    cy.heading("Request");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should click the 'Change Loans Duration'", () => {
    cy.get("a").contains("Change Loans Duration").click();
  });

  it("Should display the page heading 'Change Loans Duration'", () => {
    cy.heading("Change Loans Duration");
  });

  it("Should contain request guidance", loanDurationGuidance);

  it("Should display a table with current length and options to change 'new length'", currentLoanTable);

  it("Should allow you to update the new length using drop down options", newLoanDurationTable);

  it("Should click 'Save and continue' and go to next page", () => {
    cy.submitButton("Save and continue").click();
    cy.get("legend").contains("Mark as complete");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display the page heading 'Change Loans Duration'", () => {
    cy.heading("Change Loans Duration");
  });

  it("Should display an updated loan duration table reflecting the changes we've just made", updatedLoansTable);

  it("Should mark as complete, then 'Save and return to request'", markAndReturn);
});
