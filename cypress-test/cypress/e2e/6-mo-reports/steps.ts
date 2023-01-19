const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const navigateToProject = () => {
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("1_CYPRESS_DO_NOT_USE").click({ force: true });
};

export const navigateToSection2 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
};

export const navigateToSection3 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
  cy.getByQA("question-2-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8", { timeout: 13000 });
};

export const navigateToSection4 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
  cy.getByQA("question-2-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8", { timeout: 13000 });
  cy.getByQA("question-3-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8", { timeout: 13000 });
};

export const navigateToSection5 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8", { timeout: 13000 });
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8", { timeout: 13000 });
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8", { timeout: 13000 });
};

export const navigateToSection6 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8", { timeout: 13000 });
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8", { timeout: 13000 });
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8", { timeout: 13000 });
  cy.getByQA("question-5-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8", { timeout: 13000 });
};

export const navigateToSection7 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8", { timeout: 13000 });
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8", { timeout: 13000 });
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8", { timeout: 13000 });
  cy.getByQA("question-5-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8", { timeout: 13000 });
  cy.getByQA("question-6-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8", { timeout: 13000 });
};

export const navigateToSection8 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8", { timeout: 13000 });
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8", { timeout: 13000 });
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8", { timeout: 13000 });
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8", { timeout: 13000 });
  cy.getByQA("question-5-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8", { timeout: 13000 });
  cy.getByQA("question-6-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8", { timeout: 13000 });
  cy.submitButton("Continue").click();
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const clickMoReportTile = () => {
  cy.get("h2.card-link__title").contains("Monitoring reports").click();
};

export const startNewReportButton = () => {
  cy.get("a").contains("Start a new report");
};

export const clickStartNewReportButton = () => {
  cy.get("a").contains("Start a new report").click();
};

export const openReportTable = () => {
  cy.tableHeader("Title");
  cy.tableHeader("Status");
  cy.tableHeader("Last updated");
};

export const characterCount = () => {
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 74 characters");
};

export const q1SelectEachRadioButton = () => {
  cy.getByQA("question-1-score-5").check();
  cy.getByQA("question-1-score-4").check();
  cy.getByQA("question-1-score-3").check();
  cy.getByQA("question-1-score-2").check();
  cy.getByQA("question-1-score-1").check();
};

export const q2SelectEachRadioButton = () => {
  cy.getByQA("question-2-score-5").check();
  cy.getByQA("question-2-score-4").check();
  cy.getByQA("question-2-score-3").check();
  cy.getByQA("question-2-score-2").check();
  cy.getByQA("question-2-score-1").check();
};

export const q3SelectEachRadioButton = () => {
  cy.getByQA("question-3-score-5").check();
  cy.getByQA("question-3-score-4").check();
  cy.getByQA("question-3-score-3").check();
  cy.getByQA("question-3-score-2").check();
  cy.getByQA("question-3-score-1").check();
};

export const q4SelectEachRadioButton = () => {
  cy.getByQA("question-4-score-5").check();
  cy.getByQA("question-4-score-4").check();
  cy.getByQA("question-4-score-3").check();
  cy.getByQA("question-4-score-2").check();
  cy.getByQA("question-4-score-1").check();
};

export const q5SelectEachRadioButton = () => {
  cy.getByQA("question-5-score-5").check();
  cy.getByQA("question-5-score-4").check();
  cy.getByQA("question-5-score-3").check();
  cy.getByQA("question-5-score-2").check();
  cy.getByQA("question-5-score-1").check();
};

export const q6SelectEachRadioButton = () => {
  cy.getByQA("question-6-score-5").check();
  cy.getByQA("question-6-score-4").check();
  cy.getByQA("question-6-score-3").check();
  cy.getByQA("question-6-score-2").check();
  cy.getByQA("question-6-score-1").check();
};

export const continueAndReturnButtons = () => {
  cy.submitButton("Continue");
  cy.submitButton("Save and return to summary");
};