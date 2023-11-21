import { visitApp } from "../../../common/visit";
import {
  headingAndGuidance,
  newDescriptionEntry,
  newSummaryEntry,
  proposedDescription,
  proposedSummary,
  scopeSummaryPage,
  shouldShowProjectTitle,
  clearAndValidate,
} from "../steps";

import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Change project scope", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Change project scope");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Change project scope PCR", () => {
    cy.createPcr("Change project scope");
  });

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

  it(
    "Should now clear each section of comments and validate that description and summary are required",
    clearAndValidate,
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
    cy.heading("Change project scope"), shouldShowProjectTitle;
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
    cy.heading("Change project scope"), shouldShowProjectTitle;
  });

  it("Should mark the 'I agree with this change' checkbox and click 'Save and return to request'", () => {
    cy.clickCheckBox("I agree with this change.");
    cy.get("button").contains("Save and return to request").click();
  });
});
