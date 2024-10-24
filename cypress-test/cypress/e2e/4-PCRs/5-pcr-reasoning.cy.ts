import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { shouldShowProjectTitle, pcrAllowBatchFileUpload, accessReasoning } from "./steps";
import { loremIpsum32k, loremIpsum30k } from "common/lorem";
import { testFile } from "common/testfileNames";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { uploadDate } from "e2e/2-claims/steps";
import { Intercepts } from "common/intercepts";

const pmEmail = "james.black@euimeabs.test";

describe("PCR > Reasoning section", { tags: "smoke" }, () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", asUser: pmEmail });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("328407");
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.createPcr("Add a partner");
  });

  it("Should click into the Reasoning section", accessReasoning);

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
    cy.get("legend").contains("Reasons");
    cy.get("#hint-for-reasoning_comments").contains(
      "You must explain each change. Be brief and write clearly. If you are requesting a reallocation of project costs, you must justify each change to your costs.",
    );
  });

  it("Should type 'hello' and display the number of characters used", () => {
    cy.get("textarea").as("txt");
    cy.get("@txt").clear();
    cy.get("@txt").type("hello");
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
    cy.validationLink("Reasoning must be 32000 characters or less.");
  });

  it("Should reduce the characters by 1", () => {
    cy.get("textarea").type("{moveToEnd}").type("{backspace}");
  });

  it("Should display the number of remaining characters", () => {
    cy.paragraph("You have 0 characters remaining");
  });

  it("Should save the comments and proceed", () => {
    cy.button("Save and continue").click();
    cy.get("legend").contains("Upload documents");
  });

  it("Should test the file components", () => {
    cy.testFileComponent(
      "James Black",
      "request",
      "Request",
      "Provide reasons",
      Intercepts.PCR,
      false,
      true,
      false,
      false,
      "Files",
    );
  });

  it("Should upload a file", () => {
    cy.fileInput(testFile);
    cy.button("Upload documents").click();
    cy.validationNotification("Your document has been uploaded.");
  });

  it("Should display all the files uploaded", () => {
    [
      "testfile.doc",
      "testfile.doc",
      "testfile2.doc",
      "testfile3.doc",
      "testfile4.doc",
      "testfile5.doc",
      "testfile6.doc",
      "testfile7.doc",
      "testfile8.doc",
      "testfile9.doc",
      "testfile10.doc",
    ].forEach(doc => {
      const rowData = ["PCR evidence", uploadDate, "0KB", "James Black", "Remove"];
      rowData.forEach((data, index) => {
        cy.contains("td", doc)
          .parent()
          .within(() => {
            cy.get(`td:nth-child(${index + 2})`).contains(data);
          });
      });
    });
  });

  it("Should continue to the next page", () => {
    cy.clickOn("Save and continue");
    cy.get("legend").contains("Mark as complete");
  });

  it("Should display the comments entered in the previous comments box", () => {
    cy.getListItemFromKey("Comments", "Swindon");
  });

  it("Should mark as complete and 'Save and return to request'", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
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
    cy.getListItemFromKey("Comments", "Edit").click();
    cy.get("#hint-for-reasoning_comments").contains(
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

  it("Should validate the maximum text allowed in the reasoning box", () => {
    cy.textValidation("Reasoning", 32000, "Save and continue", true, false, false, "Reasons");
  });

  it("Should save the comments and proceed", () => {
    cy.get("legend").contains("Upload documents");
  });
});
