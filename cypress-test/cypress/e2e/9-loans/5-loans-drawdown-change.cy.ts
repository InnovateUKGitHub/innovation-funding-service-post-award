import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../common/visit";
import {
  deletePcr,
  loansEditTable,
  updateLoansValue,
  amendLoansTable,
  changeFirstValue,
  markAndContinue,
} from "./steps";

const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > Loan Drawdown Change", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
    pcrTidyUp("Loan Drawdown Change");
  });

  after(deletePcr);

  it("Should click the 'Loan Drawdown Change' checkbox and create the PCR", () => {
    cy.clickCheckBox("Loan Drawdown Change");
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

  it("Should click the 'Loan Drawdown Change' link", () => {
    cy.get("a").contains("Loan Drawdown Change").click();
  });

  it("Should display the page heading 'Loan Drawdown Change", () => {
    cy.get("h1").contains("Loan Drawdown Change");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display the loan edit table", loansEditTable);

  it("Should update the loans values to £1 per Drawdown", updateLoansValue);

  it("Should reflect the new total loans value at the bottom", () => {
    cy.get("tr").contains("£8.00");
  });

  it("Should click 'Continue to summary'", () => {
    cy.submitButton("Continue to summary").click();
  });

  it("Should have a 'Mark as complete' subheading with 'I agree with this change.' check box", () => {
    cy.get("h2").contains("Mark as complete");
    cy.getByLabel("I agree with this change.");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display a Loan Drawdown Change title", () => {
    cy.get("h1").contains("Loan Drawdown Change");
  });

  it("Should display the loan edit table", amendLoansTable);

  it(
    "Should click on the first Edit option and change the value to '£2'. It should update the total to '£9.00'",
    changeFirstValue,
  );

  it("Should click 'Continue to summary' one more time", () => {
    cy.submitButton("Continue to summary").click();
  });

  it(
    "Should 'Mark as complete', check 'I agree with this change.' and click 'Save and return to request'",
    markAndContinue,
  );
});
