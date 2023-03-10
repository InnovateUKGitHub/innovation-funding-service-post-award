import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../common/visit";
import {
  currentLoanTable,
  deletePcr,
  loanDurationGuidance,
  markAndReturn,
  newLoanDurationTable,
  updatedLoansTable,
} from "./steps";

const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > Change Loans Duration", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
    pcrTidyUp("Change Loans Duration");
  });

  after(deletePcr);

  it("Should click the 'Change Loans Duration' checkbox and create the PCR", () => {
    cy.clickCheckBox("Change Loans Duration");
    cy.submitButton("Create request").click();
  });

  it("Should load the 'Request' page", () => {
    cy.get("h1").contains("Request");
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
    cy.get("h1").contains("Change Loans Duration");
  });

  it("Should contain request guidance", loanDurationGuidance);

  it("Should display a table with current length and options to change 'new length'", currentLoanTable);

  it("Should allow you to update the new length using drop down options", newLoanDurationTable);

  it("Should click 'Save and continue' and go to next page", () => {
    cy.submitButton("Save and continue").click();
    cy.get("h2").contains("Mark as complete");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display the page heading 'Change Loans Duration'", () => {
    cy.get("h1").contains("Change Loans Duration");
  });

  it("Should display an updated loan duration table reflecting the changes we've just made", updatedLoansTable);

  it("Should mark as complete, then 'Save and return to request'", markAndReturn);
});
