import { visitApp } from "../../common/visit";

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const deleteMoReport = () => {
  visitApp({ path: "projects/a0E2600000kSotUEAS/monitoring-reports" });
  cy.getByQA("deleteLink").contains("Delete report").click();
  cy.getByQA("button_delete-qa").click({ force: true });
};

export const navigateToSection2 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
};

export const navigateToSection3 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
};

export const navigateToSection4 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
};

export const navigateToSection5 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
};

export const navigateToSection6 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
};

export const navigateToSection7 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
  cy.getByQA("question-6-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8");
};

export const navigateToSection8 = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.getByQA("button_save-continue-qa").click();
  cy.getByQA("question-1-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
  cy.getByQA("question-6-score-1").check();
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8");
  cy.submitButton("Continue").click();
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const clickMoReportTile = () => {
  cy.selectTile("Monitoring reports");
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
  [
    "question-1-score-5",
    "question-1-score-4",
    "question-1-score-3",
    "question-1-score-2",
    "question-1-score-1",
  ].forEach(q1Radio => {
    cy.getByQA(q1Radio).check();
  });
};

export const q2SelectEachRadioButton = () => {
  [
    "question-2-score-5",
    "question-2-score-4",
    "question-2-score-3",
    "question-2-score-2",
    "question-2-score-1",
  ].forEach(q2Radio => {
    cy.getByQA(q2Radio).check();
  });
};

export const q3SelectEachRadioButton = () => {
  [
    "question-3-score-5",
    "question-3-score-4",
    "question-3-score-3",
    "question-3-score-2",
    "question-3-score-1",
  ].forEach(q3Radio => {
    cy.getByQA(q3Radio).check();
  });
};

export const q4SelectEachRadioButton = () => {
  [
    "question-4-score-5",
    "question-4-score-4",
    "question-4-score-3",
    "question-4-score-2",
    "question-4-score-1",
  ].forEach(q4Radio => {
    cy.getByQA(q4Radio).check();
  });
};

export const q5SelectEachRadioButton = () => {
  [
    "question-5-score-5",
    "question-5-score-4",
    "question-5-score-3",
    "question-5-score-2",
    "question-5-score-1",
  ].forEach(q5Radio => {
    cy.getByQA(q5Radio).check();
  });
};

export const q6SelectEachRadioButton = () => {
  [
    "question-6-score-5",
    "question-6-score-4",
    "question-6-score-3",
    "question-6-score-2",
    "question-6-score-1",
  ].forEach(q6Radio => {
    cy.getByQA(q6Radio).check();
  });
};

export const continueAndReturnButtons = () => {
  cy.submitButton("Continue");
  cy.submitButton("Save and return to summary");
};

export const openHeadingArchivedHeading = () => {
  cy.get("h2").contains("Open");
  cy.get("h2").contains("Archived");
};

export const reportGuidance = () => {
  cy.getByQA("section-content").contains("Each report refers to a period");
  cy.getByQA("section-content").contains("For each section score the project");
};

export const periodSelection = () => {
  cy.getByQA("field-period").contains("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
};

export const saveContinueSaveReturn = () => {
  cy.getByQA("button_save-continue-qa").contains("Continue");
  cy.getByQA("button_save-return-qa").contains("Save and return to monitoring reports");
};

export const q1ScoreChoice = () => {
  [
    "The consortium has identified",
    "The project remains",
    "There is a possibility",
    "It appears highly likely",
    "It is certain that",
  ].forEach(q1Choice => {
    cy.get("label").contains(q1Choice);
  });
};

export const q2ScoreChoice = () => {
  [
    "ahead of schedule",
    "planned timetable",
    "current period have been met",
    "slipped by up to three months",
    "slipped by more than three months",
  ].forEach(q2Choice => {
    cy.get("label").contains(q2Choice);
  });
};

export const q3ScoreChoice = () => {
  [
    "Expenditure is lower",
    "Expenditure is in line",
    "Limited forecast evidence",
    "Forecasts not updated properly",
    "Forecasts not updated, and",
  ].forEach(q3Choice => {
    cy.get("label").contains(q3Choice);
  });
};

export const q4ScoreChoice = () => {
  ["Exceeding expectations", "Good", "Scope for improvement", "Very poor", "Unacceptable"].forEach(q4Choice => {
    cy.get("label").contains(q4Choice);
  });
};

export const q5ScoreChoice = () => {
  ["Exceeding expectations", "Good practice", "Scope for improvement", "Very poor", "Unacceptable"].forEach(
    q5Choice => {
      cy.get("label").contains(q5Choice);
    },
  );
};

export const q6ScoreChoice = () => {
  ["Exceeding expectations", "Good", "Scope for improvement", "Very poor", "Unacceptable"].forEach(q6Choice => {
    cy.get("label").contains(q6Choice);
  });
};
