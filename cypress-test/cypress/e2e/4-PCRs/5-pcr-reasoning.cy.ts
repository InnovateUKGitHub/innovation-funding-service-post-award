import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { shouldShowProjectTitle } from "./steps";
import { loremIpsum32k, loremIpsum30k } from "common/lorem";
import { testFile } from "common/testfileNames";

const pmEmail = "james.black@euimeabs.test";

describe("PCR > Reasoning section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", asUser: pmEmail });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
    cy.wait(500);
  });

  it("Will click Create request button and proceed to next page", () => {
    cy.button("Create request").click();
    cy.heading("Request");
  });

  it("Should allow Salesforce time to build the PCR", () => {
    cy.wait(5000);
  });

  it("Should click into the Reasoning section", () => {
    cy.get("a").contains("Provide reasons to Innovate UK").click();
    cy.heading("Provide reasons to Innovate UK");
    cy.reload();
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

  it("Should type 'hello' and display the number of characters used", () => {
    cy.get("textarea").clear().type("hello");
    cy.get("p").contains("You have 5 characters").should("not.exist");
  });

  it("Should populate the comments box with 30000 characters and prompt the character counter to appear", () => {
    cy.get("textarea").clear().invoke("val", loremIpsum30k).trigger("input");
    cy.get("textarea").type("{moveToEnd}").type("t");
    cy.get("textarea").type("{backSpace}");
    cy.get("p").contains("You have 2000 characters remaining");
  });

  it("Should populate the comments box with 32,001 characters", () => {
    cy.get("textarea").clear().invoke("val", loremIpsum32k).trigger("input");
    cy.get("textarea").type("{moveToEnd}").type("t");
  });

  it("Should display remaining characters as one too many", () => {
    cy.paragraph("You have 1 character too many");
  });

  it("Should not let you save and continue due to character limit and validate with a message", () => {
    cy.button("Save and continue").click();
    cy.validationLink("Reasoning can be a maximum of 32000 characters");
  });

  it("Should reduce the characters by 1", () => {
    cy.get("textarea").type("{moveToEnd}").type("{backspace}");
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
    cy.getListItemFromKey("Comments").contains("Swindon");
  });

  it("Should mark as complete and 'Save and return to request'", () => {
    cy.getByLabel("I have finished making changes.").click();
    cy.button("Save and return to request").click();
  });

  it("Should show the reasoning section as complete", () => {
    cy.get("li").contains("Complete");
  });

  it("Should re-access the reasoning section and assert that the comments have saved", () => {
    cy.get("a").contains("Provide reasons to Innovate UK").click();
    cy.heading("Provide reasons to Innovate UK");
    cy.get("p").contains("Swindon");
  });

  it("Should click the Edit button against the comments and open the freetext box", () => {
    cy.getListItemFromKey("Comments").contains("Edit").click();
    cy.get("#reasoningComments-hint").contains(
      "You must explain each change. Be brief and write clearly. If you are requesting a reallocation of project costs, you must justify each change to your costs.",
    );
    cy.get("textarea").should("have.value", loremIpsum32k);
  });

  it("Should have a character count that dynamically changes", () => {
    cy.paragraph("You have 0 characters remaining");
    cy.get("textarea").type("{moveToEnd}").type("a");
    cy.paragraph("You have 1 character too many");
  });

  it("Should type 'hello' and ensure the character counter does NOT exist", () => {
    cy.get("textarea").clear().type("hello");
    cy.get("p").contains("You have 5 characters").should("not.exist");
  });

  it("Should populate the comments box with 30000 characters and prompt the character counter to appear", () => {
    cy.get("textarea").clear().invoke("val", loremIpsum30k).trigger("input");
    cy.get("textarea").type("{moveToEnd}").type("t");
    cy.get("textarea").type("{backSpace}");
    cy.get("p").contains("You have 2000 characters remaining");
  });

  it("Should populate the comments box with 32,001 characters", () => {
    cy.get("textarea").clear().invoke("val", loremIpsum32k).trigger("input");
    cy.get("textarea").type("{moveToEnd}").type("t");
  });

  it("Should display remaining characters as one too many", () => {
    cy.paragraph("You have 1 character too many");
  });

  it("Should validate that this is too many characters when you click save", () => {
    cy.button("Save and continue").click();
    cy.validationLink("Reasoning can be a maximum of 32000 characters");
  });

  it("Should reduce the characters by 1", () => {
    cy.get("textarea").type("{moveToEnd}").type("{backspace}");
  });

  it("Should display the number of remaining characters", () => {
    cy.paragraph("You have 0 characters remaining");
  });

  it("Should save the comments and proceed", () => {
    cy.button("Save and continue").click();
    cy.get("h2").contains("Upload documents");
  });
});
