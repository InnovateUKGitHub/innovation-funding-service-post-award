import { visitApp } from "../../common/visit";
import {
  additionalInfo,
  drawdownFileUpload,
  fcDrawdownGuidance,
  drawdownRequestTable,
  fcFileUploadedSection,
  requestDrawdown,
  sendYourRequestSection,
  uploadApprovalGuidance,
  submitWithoutDocExceedChar,
  deleteAllCharSubmitWith4,
} from "./steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { fileTidyUp } from "common/filetidyup";
import { Intercepts } from "common/intercepts";
import { loremIpsum33k } from "common/lorem";

const fcEmail = "s.shuang@irc.trde.org.uk.test";

describe("Loans project > Drawdown request", { tags: "smoke" }, () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "/loans/a0E2600000kTcmIEAS" });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should click the drawdown 'Request' button and land on the drawdown request page ", requestDrawdown);

  it("Has a back link", () => {
    cy.backLink("Back to loans summary page");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should have drawdown guidance including link to drawdown pcrs", fcDrawdownGuidance);

  it("Should have the drawdown request table", drawdownRequestTable);

  it("Should show the 'Upload drawdown approval request' heading with guidance", uploadApprovalGuidance);

  it("Should test the file components", () => {
    cy.testFileComponent(
      "Sarah Shuang",
      "loans summary page",
      "Drawdowns",
      "Request",
      Intercepts.loans,
      true,
      false,
      true,
    );
  });

  it("Should upload a file and display validation message", drawdownFileUpload);

  it(
    "Should show the 'File uploaded' header and file table with the file that's just been uploaded",
    fcFileUploadedSection,
  );

  it("Should delete the file just uploaded", () => fileTidyUp("Sarah Shuang"));

  it("Should have an additional information section and enter comments into the text box", additionalInfo);

  it("Should validate the text area to 32768k characters", () => {
    cy.get("textarea").invoke("val", loremIpsum33k).trigger("input");
    cy.get("textarea").type("{moveToEnd}t");
    cy.get("textarea").type("{moveToEnd}{backSpace}");
    cy.paragraph("You have 32769 characters");
  });

  it("Should have a 'Now send your request' section with 'Accept and send' button", sendYourRequestSection);

  it(
    "Should attempt to submit the Drawdown without a document and too many characters, which prompts validation",
    submitWithoutDocExceedChar,
  );

  it(
    "Should delete all characters and enter a four-letter word prompting minimum validation",
    deleteAllCharSubmitWith4,
  );
});
