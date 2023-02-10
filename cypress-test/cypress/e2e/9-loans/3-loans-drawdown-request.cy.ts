import { visitApp } from "../../common/visit";
import {
  additionalInfo,
  deleteFile,
  drawdownFileUpload,
  drawdownGuidance,
  drawdownRequestTable,
  fileUploadedSection,
  learnFiles,
  requestDrawdown,
  sendYourRequestSection,
  uploadApprovalGuidance,
} from "./steps";

const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > Drawdown request", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "/loans/a0E2600000kTcmIEAS" });
  });

  it("Should click the drawdown 'Request' button and land on the drawdown request page ", requestDrawdown);

  it("Has a back link", () => {
    cy.backLink("Back to loans summary page");
  });

  it("Has a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should have drawdown guidance including link to drawdown pcrs", drawdownGuidance);

  it("Should have the drawdown request table", drawdownRequestTable);

  it("Should show the 'Upload drawdown approval request' heading with guidance", uploadApprovalGuidance);

  it("Should click the 'Learn more about files you can upload' link and check messaging", learnFiles);

  it("Should upload a file and display validation message", drawdownFileUpload);

  it(
    "Should show the 'File uploaded' header and file table with the file that's just been uploaded",
    fileUploadedSection,
  );

  it("Should delete the file just uploaded", deleteFile);

  it("Should have an additional information section and enter comments into the text box", additionalInfo);

  it("Should have a 'Now send your request' section with 'Accept and send' button", sendYourRequestSection);
});
