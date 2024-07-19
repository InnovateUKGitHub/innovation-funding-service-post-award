import { visitApp } from "common/visit";
import {
  correctCostListforPeriod,
  loansCostsPageNavigate,
  loansForecastCosts,
  navigateCheckForUpdatedValues,
  navigateDocDelete,
  navigateToSummary,
  projCostsDownload,
  projCostsFileUpload,
  resetCosts,
  supportingEvidence,
  updateLoansCosts,
  workingBackLink,
} from "./steps";
import { shouldShowProjectTitle } from "e2e/2-claims/steps";
import { loansProjCostCleanUp } from "common/costCleanUp";
import { fileTidyUp } from "common/filetidyup";

const fc = "s.shuang@irc.trde.org.uk.test";

describe("Loans > Project costs > Summary", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("191431");
  });

  it(
    "Should click the Project costs tile and display the correct heading navigate to the Costs for period page",
    loansCostsPageNavigate,
  );

  it("Should check the first line costs are correct", loansProjCostCleanUp);

  it("Should navigate to costs page and clean up any files that are there", () => {
    cy.clickOn("Continue to costs documents");
    cy.heading("Supporting evidence");
    fileTidyUp("Sarah Shuang");
  });

  it("Should navigate to summary", navigateToSummary);

  it("Should have a working backlink", workingBackLink);

  it("Should have the correct project title", shouldShowProjectTitle);

  it("Should show correct Period number", () => {
    cy.get("h2").contains("Period 1");
  });

  it("Should display correct Costs for period subheading", () => {
    cy.get("h3").contains("Costs for period");
  });

  it("Should show correct costs list for period", correctCostListforPeriod);

  it("Should show forecasted costs", loansForecastCosts);

  it("Should use the 'Edit costs for this period' link", () => {
    cy.get("a").contains("Edit costs for this period").click();
    cy.heading("Costs for this period");
  });

  it("Should now update 'Loans costs for Industrial participants', save and return to summary", updateLoansCosts);

  it("Should navigate back to summary and check for updated values", navigateCheckForUpdatedValues);

  it("Should display a Supporting evidence section with messaging", supportingEvidence);

  it("Should navigate to Supporting evidence section", () => {
    cy.get("a").contains("Edit supporting evidence").click();
    cy.heading("Supporting evidence");
  });

  it("Should upload a file", projCostsFileUpload);

  it("Should navigate back to Summary page", navigateToSummary);

  it("Should display the document uploaded on the Summary screen", () => {
    cy.paragraph("All documents open in a new window.");
    cy.get("a").contains("testfile.doc");
  });

  it("Should validate downloading of file", projCostsDownload);

  it("Should have a working 'Edit forecast' link", () => {
    cy.get("a").contains("Edit forecast").click();
    cy.heading("Update forecast");
  });

  it("Should navigate back to Summary screen", () => {
    cy.button("Continue to summary").click();
    cy.heading("Costs summary");
  });

  it("Should have an 'Add comments' section", () => {
    cy.get("legend").contains("Add comments");
    cy.get("#hint-for-comments").contains(
      "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.",
    );
  });

  it("Should validate the text area input for maximum characters", () => {
    cy.textValidation("Comments", 1000, "Save and return to project costs", true);
    cy.heading("Project costs");
    cy.get("a").contains("Edit").click();
    cy.heading("Costs for this period");
    cy.clickOn("Continue to costs documents");
    cy.heading("Supporting evidence");
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Costs summary");
  });

  it("Should have pre-submission confirmation message", () => {
    cy.paragraph(
      "I confirm that the information I have provided for this period is correct, complete and contains only eligible costs on an actual basis, which we confirm have been incurred and defrayed. I understand and accept that if I knowingly withhold information, or provide false or misleading information, this may result in funding being withdrawn, termination of the loan, recovery of loan proceeds and outstanding interest, civil action and where there is evidence of fraud, criminal prosecution.",
    );
  });

  it("Should have a Submit claim button", () => {
    cy.button("Submit costs");
  });

  it("Should Save and return to project costs", () => {
    cy.button("Save and return to project costs").click();
    cy.heading("Project costs");
  });

  it("Should re-access the period costs and reset the costs for 'Loans cost' category'", resetCosts);

  it("Should navigate to the documents section and delete the document", navigateDocDelete);
});
