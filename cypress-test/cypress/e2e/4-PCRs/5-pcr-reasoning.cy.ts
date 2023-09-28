import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { clickCreateRequestButtonProceed, shouldShowProjectTitle } from "./steps";
import { loremIpsum32k } from "common/lorem";
import { testFile } from "common/testfileNames";
import { deletePcr } from "e2e/9-loans/steps";

const pmEmail = "james.black@euimeabs.test";

describe("PCR > Save and return to requests", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", asUser: pmEmail });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should click into the Reasoning section", () => {
    cy.get("a").contains("Provide reasons to Innovate UK").click();
    cy.heading("Provide reasons to Innovate UK");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should contain PCR details", () => {
    ["Request number", "Types", "Add a partner"].forEach(pcrInfo => {
      cy.get("dl").contains(pcrInfo);
    });
  });

  it("Should contain Reasoning subheading", () => {
    cy.get("#reasoningComments-hint").contains(
      "You must explain each change. Be brief and write clearly. If you are requesting a reallocation of project costs, you must justify each change to your costs.",
    );
  });

  it("Should populate the comments box with 32,000 characters", () => {
    cy.get("textarea").invoke("val", loremIpsum32k);
  });

  it("Should display the number of remaining characters", () => {
    cy.paragraph("You have 0 characters remaining");
  });

  it("Should save the comments and proceed", () => {
    cy.button("Save and continue").click();
    cy.heading("Provide reasons to Innovate UK");
  });

  it("Should upload a file", () => {
    cy.fileInput(testFile);
    cy.button("Upload documents").click();
    cy.validationNotification("Your document has been uploaded.");
  });

  it("Should continue to the next page", () => {
    cy.get("a").contains("Save and continue").click();
    cy.get("h2").contains("Mark as complete");
  });

  it("Should display the comments entered in the previous comments box", () => {
    cy.getByQA("comments").contains(loremIpsum32k);
    cy.getByQA("files").contains(testFile);
  });

  it("Should mark as complete and 'Save and return to request'", () => {
    cy.getByLabel("I have finished making changes.").click();
    cy.button("Save and return to request").click();
  });

  it("Should show the reasoning section as complete", () => {
    cy.get("#reasoningStatus").eq(5).contains("Complete");
  });

  it("Should re-access the reasoning section and assert that the comments have saved", () => {
    cy.get("a").contains("Provide reasoning to Innovate UK").click();
    cy.heading("Provide reasoning to Innovate UK");
    cy.getByQA("comments").contains(loremIpsum32k);
  });
});
