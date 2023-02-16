import { visitApp } from "../../../common/visit";
import {
  clickCreateRequestButtonProceed,
  deletePcr,
  headingAndGuidance,
  newDescriptionEntry,
  newSummaryEntry,
  proposedDescription,
  proposedSummary,
  scopeSummaryPage,
  shouldShowProjectTitle,
} from "../steps";

import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Change project scope", () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Change project scope");
  });

  after(deletePcr);

  it("Should select 'Change project scope", () => {
    cy.clickCheckBox("Change project scope");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should then click into the Change project scope section of the PCR", () => {
    cy.get("a").contains("Change project scope").click();
  });

  it("Should display the page heading along with guidance", headingAndGuidance);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should include the project title", shouldShowProjectTitle);

  it(
    "Should show a 'Proposed public description' subheading and expand to view the previous project scope",
    proposedDescription,
  );

  it("Should now enter a new project scope and count the number of characters used", newDescriptionEntry);

  it("Should click 'Save and continue' to the next page", () => {
    cy.submitButton("Save and continue").click();
  });

  it(
    "Should load the next page and display 'Proposed project summary' and click 'Published project summary'",
    proposedSummary,
  );

  it("Should again have the project title and page heading", () => {
    cy.get("h1").contains("Change project scope"), shouldShowProjectTitle;
  });

  it("Should also have a back link", () => {
    cy.backLink("Back to request");
  });

  it("Should enter further comments and calculate the number of characters used", newSummaryEntry);

  it("Should 'Save and continue' to the next page", () => {
    cy.submitButton("Save and continue").click();
  });

  it(
    "Should land on a summary page containing current Project summary and Project scope as well as the new scope and summary",
    scopeSummaryPage,
  );

  it("Should also have a back link", () => {
    cy.backLink("Back to request");
  });

  it("Should again have the project title and page heading", () => {
    cy.get("h1").contains("Change project scope"), shouldShowProjectTitle;
  });

  it("Should mark the 'I agree with this change' checkbox and click 'Save and return to request'", () => {
    cy.clickCheckBox("I agree with this change.");
    cy.submitButton("Save and return to request").click();
  });
});
