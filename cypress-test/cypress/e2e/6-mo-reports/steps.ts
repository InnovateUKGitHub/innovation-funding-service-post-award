import { visitApp } from "../../common/visit";
import { moReportTidyup } from "common/mo-report-tidyup";

const section1Comments = "Section 1 // *&^%";
const section2Comments = "Section 2 // *&^%";
const section3Comments = "Section 3 // *&^%";
const section4Comments = "Section 4 // *&^%";
const section5Comments = "Section 5 // *&^%";
const section6Comments = "Section 6 // *&^%";
const section7Comments = "Section 7 // *&^%";
const section8Comments = "Section 8 // *&^%";

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

export const deleteMoReport = () => {
  visitApp({ path: "projects/a0E2600000kSotUEAS/monitoring-reports" });
  cy.getByQA("deleteLink").contains("Delete report").click();
  cy.button("Delete").click({ force: true });
};

export const navigateToSection2 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
};

export const navigateToSection3 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").type(section2Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
};

export const navigateToSection4 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").type(section2Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.get("textarea").type(section3Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
};

export const navigateToSection5 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").type(section2Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.get("textarea").type(section3Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.get("textarea").type(section4Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
};

export const navigateToSection6 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").type(section2Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.get("textarea").type(section3Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.get("textarea").type(section4Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.get("textarea").type(section5Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
};

export const navigateToSection7 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").type(section2Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.get("textarea").type(section3Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.get("textarea").type(section4Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.get("textarea").type(section5Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
  cy.getByQA("question-6-score-1").check();
  cy.get("textarea").type(section6Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8");
};

export const navigateToSection8 = () => {
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").type(section1Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").type(section2Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.get("textarea").type(section3Comments);
  cy.wait(1000);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.get("textarea").type(section4Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.get("textarea").type(section5Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
  cy.getByQA("question-6-score-1").check();
  cy.get("textarea").type(section6Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8");
  cy.get("textarea").type(section7Comments);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 8");
};

export const completeAllSectionsWithComments = () => {
  cy.getByLabel("Period");
  cy.get("input#period").clear().type("1");
  cy.wait(500);
  cy.button("Continue").click();
  cy.getByQA("question-1-score-1").check();
  cy.get("textarea").clear().type(section1Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 2 of 8");
  cy.getByQA("question-2-score-1").check();
  cy.get("textarea").clear().type(section2Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 3 of 8");
  cy.getByQA("question-3-score-1").check();
  cy.get("textarea").clear().type(section3Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 4 of 8");
  cy.getByQA("question-4-score-1").check();
  cy.get("textarea").clear().type(section4Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 5 of 8");
  cy.getByQA("question-5-score-1").check();
  cy.get("textarea").clear().type(section5Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 6 of 8");
  cy.getByQA("question-6-score-1").check();
  cy.get("textarea").clear().type(section6Comments);
  cy.wait(500);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 7 of 8");
  cy.get("textarea").clear().type(section7Comments);
  cy.submitButton("Continue").click();
  cy.get("h3").contains("Section 8");
  cy.get("textarea").clear().type(section8Comments);
  cy.wait(500);
};

export const completeSection8 = () => {
  cy.getByQA("summary-question-8").contains("Edit").click();
  cy.get("textarea").clear().type(section8Comments);
  cy.button("Save and return to summary").click();
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
  moReportTidyup("Draft");
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
  cy.button("Continue");
  cy.button("Save and return to summary");
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
  cy.getByLabel("Period");
  cy.get("input#period").type("1");
  cy.wait(500);
};

export const saveContinueSaveReturn = () => {
  cy.button("Continue");
  cy.button("Save and return to monitoring reports");
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

export const loremIpsumWithLineBreaks =
  "Lorem ipsum dolor sit amet, agam saperet electram mea ea. Has no munere reprimique. \nIus an magna movet mediocrem, at mea dicit laudem. Mei id mutat dolorem nostrum, sed no integre accusamus, ius ut mandamus deseruisse. \nMundi postea mea te, enim detraxit scriptorem te vis. Sea melius fuisset splendide in. Ut per soluta laoreet. No mea eleifend sapientem persequeris. \nEa ubique eligendi nam, vim cu putent sententiae incorrupte. Cu qui voluptua voluptaria liberavisse. Duo ne aeterno graecis, cum duis splendide ei, vis ludus vocent rationibus id. \nEu dicit ullamcorper mea. Scripserit referrentur consectetuer ad est, vix an commodo dolorem conceptam, his no tollit apeirian insolens. \nComplectitur intellegebat interpretaris est ad, est aeque inermis eloquentiam ex. Admodum cotidieque ad sea. Et his debet cetero, sea feugait mediocrem an. Eu nonumes fastidii mediocritatem has, stet vitae laudem ne vel, at usu percipit accommodare. \nNe nam dicunt principes, sed ad amet admodum mediocrem. Graeci possit democritum eam an. Ut odio tibique ancillae vis. Pri at accusata democritum, per eius postulant salutatus te. \nPri eu oportere torquatos assueverit, ne impedit albucius nam, oratio tritani vivendo ius cu. Possit disputationi nec eu. Persius eruditi constituam no vim, adhuc graeco ea mei. Ut pri sonet offendit expetendis. Ne odio minim eam, recteque concludaturque ex usu, an sed epicurei perpetua abhorreant. \nLorem ipsum dolor sit amet, agam saperet electram mea ea. Has no munere reprimique. \nIus an magna movet mediocrem, at mea dicit laudem. Mei id mutat dolorem nostrum, sed no integre accusamus, ius ut mandamus deseruisse. \nMundi postea mea te, enim detraxit scriptorem te vis. Sea melius fuisset splendide in. Ut per soluta laoreet. No mea eleifend sapientem persequeris. \nEa ubique eligendi nam, vim cu putent sententiae incorrupte. Cu qui voluptua voluptaria liberavisse. Duo ne aeterno graecis, cum duis splendide ei, vis ludus vocent rationibus id. \nEu dicit ullamcorper mea. Scripserit referrentur consectetuer ad est, vix an commodo dolorem conceptam, his no tollit apeirian insolens. \nComplectitur intellegebat interpretaris est ad, est aeque inermis eloquentiam ex. Admodum cotidieque ad sea. Et his debet cetero, sea feugait mediocrem an. Eu nonumes fastidii mediocritatem has, stet vitae laudem ne vel, at usu percipit accommodare. \nNe nam dicunt principes, sed ad amet admodum mediocrem. Graeci possit democritum eam an. Ut odio tibique ancillae vis. Pri at accusata democritum, per eius postulant salutatus te. \nPri eu oportere torquatos assueverit, ne impedit albucius nam, oratio tritani vivendo ius cu. Possit disputationi nec eu. Persius eruditi constituam no vim, adhuc graeco ea mei. Ut pri sonet offendit expetendis. Ne odio minim eam, recteque concludaturque ex usu, an sed epicurei perpetua abhorreant.";

export const loremIpsumNoLineBreaks =
  "Lorem ipsum dolor sit amet, agam saperet electram mea ea. Has no munere reprimique. Ius an magna movet mediocrem, at mea dicit laudem. Mei id mutat dolorem nostrum, sed no integre accusamus, ius ut mandamus deseruisse. Mundi postea mea te, enim detraxit scriptorem te vis. Sea melius fuisset splendide in. Ut per soluta laoreet. No mea eleifend sapientem persequeris. Ea ubique eligendi nam, vim cu putent sententiae incorrupte. Cu qui voluptua voluptaria liberavisse. Duo ne aeterno graecis, cum duis splendide ei, vis ludus vocent rationibus id. Eu dicit ullamcorper mea. Scripserit referrentur consectetuer ad est, vix an commodo dolorem conceptam, his no tollit apeirian insolens. Complectitur intellegebat interpretaris est ad, est aeque inermis eloquentiam ex. Admodum cotidieque ad sea. Et his debet cetero, sea feugait mediocrem an. Eu nonumes fastidii mediocritatem has, stet vitae laudem ne vel, at usu percipit accommodare. Ne nam dicunt principes, sed ad amet admodum mediocrem. Graeci possit democritum eam an. Ut odio tibique ancillae vis. Pri at accusata democritum, per eius postulant salutatus te. Pri eu oportere torquatos assueverit, ne impedit albucius nam, oratio tritani vivendo ius cu. Possit disputationi nec eu. Persius eruditi constituam no vim, adhuc graeco ea mei. Ut pri sonet offendit expetendis. Ne odio minim eam, recteque concludaturque ex usu, an sed epicurei perpetua abhorreant. Lorem ipsum dolor sit amet, agam saperet electram mea ea. Has no munere reprimique. Ius an magna movet mediocrem, at mea dicit laudem. Mei id mutat dolorem nostrum, sed no integre accusamus, ius ut mandamus deseruisse. Mundi postea mea te, enim detraxit scriptorem te vis. Sea melius fuisset splendide in. Ut per soluta laoreet. No mea eleifend sapientem persequeris. Ea ubique eligendi nam, vim cu putent sententiae incorrupte. Cu qui voluptua voluptaria liberavisse. Duo ne aeterno graecis, cum duis splendide ei, vis ludus vocent rationibus id. Eu dicit ullamcorper mea. Scripserit referrentur consectetuer ad est, vix an commodo dolorem conceptam, his no tollit apeirian insolens. Complectitur intellegebat interpretaris est ad, est aeque inermis eloquentiam ex. Admodum cotidieque ad sea. Et his debet cetero, sea feugait mediocrem an. Eu nonumes fastidii mediocritatem has, stet vitae laudem ne vel, at usu percipit accommodare. Ne nam dicunt principes, sed ad amet admodum mediocrem. Graeci possit democritum eam an. Ut odio tibique ancillae vis. Pri at accusata democritum, per eius postulant salutatus te. Pri eu oportere torquatos assueverit, ne impedit albucius nam, oratio tritani vivendo ius cu. Possit disputationi nec eu. Persius eruditi constituam no vim, adhuc graeco ea mei. Ut pri sonet offendit expetendis. Ne odio minim eam, recteque concludaturque ex usu, an sed epicurei perpetua abhorreant.";

export const section1Summary = () => {
  cy.get("h3").contains("Scope");
  [
    "Score",
    "Comments",
    "1 - It is certain that the project will fail to deliver on one or more key objectives",
    "Section 1 // *&^%",
    "Edit",
  ].forEach(section1Item => {
    cy.getByQA("summary-question-1").contains(section1Item);
  });
};

export const section2Summary = () => {
  cy.get("h3").contains("Time");
  [
    "Score",
    "Comments",
    "1 - Milestones and deliverables for the current period have slipped by more than three months",
    "Section 2 // *&^%",
    "Edit",
  ].forEach(section2Item => {
    cy.getByQA("summary-question-2").contains(section2Item);
  });
};

export const section3Summary = () => {
  cy.get("h3").contains("Cost");
  [
    "Score",
    "Comments",
    "1 - Under/overspend +/- >21%. Expenditure is routinely not commensurate with progress. Forecasts not updated, and routinely inaccurate",
    "Section 3 // *&^%",
    "Edit",
  ].forEach(section3Item => {
    cy.getByQA("summary-question-3").contains(section3Item);
  });
};

export const section4Summary = () => {
  cy.get("h3").contains("Exploitation");
  ["Score", "Comments", "1 - Unacceptable", "Section 4 // *&^%", "Edit"].forEach(section4Item => {
    cy.getByQA("summary-question-4").contains(section4Item);
  });
};

export const section5Summary = () => {
  cy.get("h3").contains("Risk management");
  ["Score", "Comments", "1 - Unacceptable", "Section 5 // *&^%", "Edit"].forEach(section5Item => {
    cy.getByQA("summary-question-5").contains(section5Item);
  });
};

export const section6Summary = () => {
  cy.get("h3").contains("Project planning");
  ["Score", "Comments", "1 - Unacceptable", "Section 6 // *&^%", "Edit"].forEach(section6Item => {
    cy.getByQA("summary-question-6").contains(section6Item);
  });
};

export const section7Summary = () => {
  cy.get("h3").contains("Summary");
  ["Comments", "Section 7 // *&^%", "Edit"].forEach(section7Item => {
    cy.getByQA("summary-question-7").contains(section7Item);
  });
};

export const section8Summary = () => {
  cy.get("h3").contains("Issues and actions");
  ["Comments", "Section 8 // *&^%", "Edit"].forEach(section8Item => {
    cy.getByQA("summary-question-8").contains(section8Item);
  });
};

export const backAllTheWayOut = () => {
  cy.getByQA("summary-question-8").contains("Edit").click();
  cy.get("h3").contains("Section 8 of 8");
  cy.backLink("Back to summary").click();
  cy.backLink("Back to project planning").click();
  cy.backLink("Back to risk management").click();
  cy.backLink("Back to exploitation").click();
  cy.backLink("Back to cost").click();
  cy.backLink("Back to time").click();
  cy.backLink("Back to scope").click();
  cy.backLink("Back to Monitoring Reports").click();
  cy.backLink("Back to summary").click();
  cy.backLink("Back to Monitoring Reports").click();
  cy.get("h1").contains("Monitoring reports");
};

export const accessDraftReport = () => {
  cy.tableCell("Draft").siblings().contains("Edit report").click();
  cy.get("h1").contains("Monitoring report");
};

export const editSection3 = () => {
  cy.getByQA("summary-question-3").contains("Edit").click();
  cy.get("legend").contains("Cost");
  cy.getByQA("question-3-score-4").click();
  cy.get("textarea").clear().type("This is a new comment for Section 3 // *&^%");
  cy.button("Save and return to summary").click();
};

export const reflectSection3 = () => {
  cy.get("h3").contains("Cost");
  [
    "Score",
    "Comments",
    "4 - Under/overspend within +/- 6-10%. Accurate & evidenced forecasts are in place. Expenditure is in line with planned activity and budget",
    "This is a new comment for Section 3 // *&^%",
    "Edit",
  ].forEach(section3Item => {
    cy.getByQA("summary-question-3").contains(section3Item);
  });
};

export const editSection1 = () => {
  cy.getByQA("summary-question-1").contains("Edit").click();
  cy.get("legend").contains("Scope");
  cy.getByQA("question-1-score-5").click();
  cy.get("textarea").clear().type("This is a new comment for Section 1 // *&^%");
  cy.button("Continue").click();
};

export const updateSection2 = () => {
  cy.get("legend").contains("Time");
  cy.getByQA("question-2-score-5").click();
  cy.get("textarea").clear().type("This is a new comment for Section 2 // *&^%");
  cy.button("Continue").click();
};

export const skipSection3Update4 = () => {
  cy.get("legend").contains("Cost");
  cy.button("Continue").click();
  cy.get("legend").contains("Exploitation");
  cy.getByQA("question-4-score-5").click();
  cy.get("textarea").clear().type("This is a new comment for Section 4 // *&^%");
  cy.button("Save and return to summary").click();
  cy.heading("Monitoring report");
};

export const reflectSection1Changes = () => {
  cy.get("h3").contains("Cost");
  [
    "Score",
    "Comments",
    "5 - The consortium has identified opportunities, beyond those specified in it's proposal, and plans to explore these within this project",
    "This is a new comment for Section 1 // *&^%",
    "Edit",
  ].forEach(section1Item => {
    cy.getByQA("summary-question-1").contains(section1Item);
  });
};

export const reflectSection2Changes = () => {
  cy.get("h3").contains("Cost");
  [
    "Score",
    "Comments",
    "5 - The project is running ahead of schedule",
    "This is a new comment for Section 2 // *&^%",
    "Edit",
  ].forEach(section2Item => {
    cy.getByQA("summary-question-2").contains(section2Item);
  });
};

export const reflectSection4Changes = () => {
  cy.get("h3").contains("Cost");
  ["Score", "Comments", "5 - Exceeding expectations", "This is a new comment for Section 4 // *&^%", "Edit"].forEach(
    section4Item => {
      cy.getByQA("summary-question-4").contains(section4Item);
    },
  );
};

export const editSection5WithCopy = () => {
  cy.getByQA("summary-question-5").contains("Edit").click();
  cy.get("legend").contains("Risk management");
  cy.get("textarea").clear().type(loremIpsumWithLineBreaks);
  cy.paragraph("You have 2844 characters");
  cy.button("Save and return to summary").click();
  cy.heading("Monitoring report");
};

export const reflectSection5Changes = () => {
  cy.get("h3").contains("Risk management");
  ["Score", "Comments", "1 - Unacceptable", "Edit", loremIpsumNoLineBreaks].forEach(section5Item => {
    cy.getByQA("summary-question-5").contains(section5Item);
  });
};

export const validateMoReport = () => {
  cy.button("Continue").click();
  cy.get("h3").contains("Section 1 of 8");
  cy.button("Save and return to summary").click();
  cy.button("Submit").click({ timeout: 30000 });
  [
    "Enter comments for scope.",
    "Enter a score for scope.",
    "Enter comments for time.",
    "Enter a score for time.",
    "Enter comments for cost.",
    "Enter a score for cost",
    "Enter comments for exploitation",
    "Enter a score for exploitation",
    "Enter comments for risk management.",
    "Enter a score for risk management.",
    "Enter comments for project planning.",
    "Enter a score for project planning.",
    "Enter comments for summary.",
    "Enter comments for issues and actions",
  ].forEach(validation => {
    cy.validationLink(validation);
  });
  cy.validationMessage("There is a problem");
};

export const validatePeriodBox = () => {
  cy.getByLabel("Period");
  cy.get("input#period").clear().type("NaN");
  cy.wait(500);
  cy.button("Continue").click();
  cy.validationMessage("There is a problem");
  cy.validationLink("Period must be a whole number, like 3.");
  cy.get("input#period").clear().type("1");
  cy.wait(500);
};

export const saveSectionOneAndCheckSummary = () => {
  cy.button("Save and return to summary").click();
  cy.heading("Monitoring report");
  cy.get("h3").contains("Scope");
  [
    "Score",
    "Comments",
    "1 - It is certain that the project will fail to deliver on one or more key objectives",
    "This is a standard message for use in a text box. I am 74 characters long.",
    "Edit",
  ].forEach(section1Item => {
    cy.getByQA("summary-question-1").contains(section1Item);
  });
};
export const assertSection7Comments = () => {
  cy.backLink("Back to summary").click();
  cy.get("legend").contains("Summary");
  cy.get("textarea").contains(section7Comments);
};

export const assertSectionCommentsAndScore = (title: string, section: number) => {
  cy.backLink(`Back to ${title.toLowerCase()}`).click();
  cy.get("legend").contains(title);
  cy.getByQA(`question-${String(section)}-score-1`).should("have.attr", "checked");
  cy.get("textarea").contains(`Section ${String(section)} // *&^%`);
};

export const deleteUsingCorrectDeleteButton = () => {
  cy.button("Save and return to project").click();
  cy.getByQA("deleteLink").contains("Delete report").click();
  cy.button("Delete report").should("have.css", "background-color").and("eq", "rgb(212, 53, 28)");
  cy.button("Delete report").click();
  cy.getByQA("deleteLink").should("not.exist");
};
