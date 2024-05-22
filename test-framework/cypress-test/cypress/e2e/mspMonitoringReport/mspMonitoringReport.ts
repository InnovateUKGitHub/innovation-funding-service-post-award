import { Then, When, Step } from "@badeball/cypress-cucumber-preprocessor";

When("the user starts a new report in period {string}", function (period: string) {
  cy.getGovButton("Start a new report").click();
  cy.getLoading().should("not.exist");
  if (period) cy.getByLabel("Period").type(period);
  cy.getGovButton("Continue").click();
});

When("the user answers the monitoring questions", function () {
  Step(this, 'the user answers question 1 with a score of 5 and a comment of "Question One"');
  Step(this, 'the user answers question 2 with a score of 4 and a comment of "Question Two"');
  Step(this, 'the user answers question 3 with a score of 3 and a comment of "Question Three"');
  Step(this, 'the user answers question 4 with a score of 2 and a comment of "Question Four"');
  Step(this, 'the user answers question 5 with a score of 1 and a comment of "Question Five"');
  Step(this, 'the user answers question 6 with a score of 4 and a comment of "Question Six"');
  Step(this, 'the user answers question 7 with a comment of "Question Seven"');
  Step(this, 'the user answers question 8 with a comment of "Question Eight"');
});

When(
  "the user answers question {int} with a score of {int} and a comment of {string}",
  function (question: number, score: number, comment: string) {
    cy.getHeading(new RegExp(`Section ${question} of \\d+`), { timeout: Cypress.env("SALESFORCE_TIMEOUT") }).should(
      "exist",
    );
    cy.getByLabel(new RegExp(`^${score} -`)).click();
    cy.getByLabel("Comment").type(comment);
    cy.getGovButton("Continue").click();
  },
);

When("the user sees question {int}", function (question: number) {
  cy.getHeading(new RegExp(`Section ${question} of \\d+`), { timeout: Cypress.env("SALESFORCE_TIMEOUT") }).should(
    "exist",
  );
});

When("the user answers question {int} with a comment of {string}", function (question: number, comment: string) {
  cy.getHeading(new RegExp(`Section ${question} of \\d+`), { timeout: Cypress.env("SALESFORCE_TIMEOUT") }).should(
    "exist",
  );
  cy.getByLabel("Comment").type(comment);
  cy.getGovButton("Continue").click();
});

When("the user submits the report", function () {
  cy.getGovButton("Submit report").click();
});

When("the user goes back", function () {
  cy.get("a.govuk-back-link", { timeout: Cypress.env("SALESFORCE_TIMEOUT") }).click();
});

When("the user goes back {int} times", function (times: number) {
  for (let i = 0; i < times; i++) {
    Step(this, "the user goes back");
  }
});

Then("the user sees a period {string} report in {string}", function (period: string, status: string) {
  cy.getTableShape("current-reports-table", {
    head: [["Title", "Status", "Last updated", "Action"]],
    body: [[new RegExp(`^Period ${period}`), status, undefined, undefined]],
  });
});

Then("the period is rejected because a period has not been entered", function () {
  cy.getValidationError().should("contain.text", "Enter a period.");
});

Then("the period is rejected because the period is out of range", function () {
  // TODO: Fix the copy to be just... "Period must be 1"
  cy.getValidationError().should("contain.text", "Period must be between 1 and 1.");
});

Then("the period is rejected because the period is invalid", function () {
  cy.getValidationError().should("contain.text", "Enter a valid period.");
});

Then("the period is rejected because the period is a non-integer", function () {
  cy.getValidationError().should("contain.text", "Period must be a whole number, like 3.");
});

Then("the report is rejected because {string} was missing", function (missing: string) {
  cy.getValidationError().should("include.text", `Enter ${missing}.`);
});
