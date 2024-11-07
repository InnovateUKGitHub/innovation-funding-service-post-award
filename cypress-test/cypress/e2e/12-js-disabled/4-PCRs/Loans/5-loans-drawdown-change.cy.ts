import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import {
  acceptNegativeInput,
  amendLoansTable,
  changeFirstValue,
  loansEditTable,
  markAndContinue,
  updateLoansValue,
} from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("js-disabled > Loans project > Loan Drawdown Change", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Loan Drawdown Change");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  after(() => {
    cy.deletePcr("191431");
  });

  it("Should click the 'Loan Drawdown Change' checkbox and create the PCR", () => {
    cy.createPcr("Loan Drawdown Change", { jsDisabled: true });
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

  it("Should click the 'Loan Drawdown Change' link", () => {
    cy.get("a").contains("Loan Drawdown Change").click();
  });

  it("Should display the page heading 'Loan Drawdown Change", () => {
    cy.heading("Loan Drawdown Change");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display the loan edit table", loansEditTable);

  it("Should update the loans values to £1 per Drawdown", updateLoansValue);

  it("Should click 'Continue to summary'", () => {
    cy.submitButton("Continue to summary").click();
    cy.get("legend").contains("Mark as complete");
  });

  it("Should have a 'Mark as complete' subheading with 'I agree with this change.' check box", () => {
    cy.getByLabel("I agree with this change.");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should display a Loan Drawdown Change title", () => {
    cy.heading("Loan Drawdown Change");
  });

  it("Should display the loan edit table", amendLoansTable);

  it(
    "Should click on the first Edit option and change the value to '£2'. It should update the total to '£9.00'",
    changeFirstValue,
  );

  it("Should accept a negative input", acceptNegativeInput);

  it("Should click 'Continue to summary' one more time and assert correct total", () => {
    cy.submitButton("Continue to summary").click();
    cy.get("tfoot").within(() => {
      cy.get("th:nth-child(5)").contains("-£193.00");
    });
  });

  it(
    "Should 'Mark as complete', check 'I agree with this change.' and click 'Save and return to request'",
    markAndContinue,
  );
});
