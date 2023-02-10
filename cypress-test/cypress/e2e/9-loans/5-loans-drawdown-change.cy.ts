import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../common/visit";
import { explainReasoningTodo, giveUsInfoTodo } from "./steps";

const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > Loan Drawdown Change", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
    pcrTidyUp("Loan Drawdown Change");
  });

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

  it("Should show the  'Give us information' section", giveUsInfoTodo);

  it("Should show the reasoning section", explainReasoningTodo);
});
