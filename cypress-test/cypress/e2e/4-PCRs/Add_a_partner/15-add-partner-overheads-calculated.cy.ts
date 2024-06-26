import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  allowBatchFileUpload,
  allowLargerBatchFileUpload,
  deleteDocument,
  deleteSingleChar,
  displayBatchUpload,
  doNotUploadSpecialChar,
  documents,
  learnFiles,
  rejectElevenDocsAndShowError,
  uploadFileNameTooShort,
  uploadFileTooLarge,
  uploadSingleChar,
  validateExcessiveFileName,
  validateFileUpload,
  validationMessageCumulative,
} from "common/fileComponentTests";
import { seconds } from "common/seconds";
import {
  collaboratorAndBusiness,
  completeLabourForm,
  displayCostCatTable,
  navigateToCostCat,
  navigateToPartnerCosts,
} from "./add-partner-e2e-steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import {
  calculateOverheadsDocsButton,
  calculatedGuidance,
  clickCalculatedAccessDocs,
  clickTwentyPercentAndSave,
  navigateBackSelectZeroPercent,
  saveAndReturnEnter10k,
  validateAlphaNotAllowed,
  validateThreeDecimalPlaces,
  validateValueRequired,
} from "./costs-steps";

const pm = "james.black@euimeabs.test";

describe("PCR > Add Partner > Calculated Overheads", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
  });

  after(() => {
    cy.deletePcr("328407");
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should create an add partner PCR and access Add a partner", () => {
    cy.createPcr("Add a partner");
    cy.get("a").contains("Add a partner").click();
    cy.heading("Add a partner");
  });

  it("Should complete as a collaborator and business", collaboratorAndBusiness);

  it("Should navigate to the 'Project costs for new partner' page", navigateToPartnerCosts);

  it("Should display a cost category table", displayCostCatTable);

  it("Should access the Labour section", () => navigateToCostCat("Labour", 1));

  it("Should complete the Labour form", completeLabourForm);

  it("Should access the Overheads section", () => navigateToCostCat("Overheads", 2));

  it("Should have three radio buttons and will click them in turn", () => {
    ["0%", "20%", "Calculated"].forEach(radio => {
      cy.getByLabel(radio).click();
      cy.wait(300);
    });
  });

  it("should have additional guidance for calculated appear now 'Calculated' is selected", () => {
    cy.paragraph(
      "You will need to submit an overheads calculation spreadsheet, available following the link below, if the new partner feels their overheads are higher than 20%.",
    );
  });

  it("Should validate that a value is required when saving", validateValueRequired);

  it("Should validate that alpha characters are not allowed", validateAlphaNotAllowed);

  it("Should validate 3 decimal places", validateThreeDecimalPlaces);

  it("Should clear the input field", () => {
    cy.getByLabel("Total cost of overheads as calculated in the spreadsheet (£)").clear();
  });

  it(
    "should click on 'Calculate overheads documents' and continue, ensuring no validation is present for the cost input",
    calculateOverheadsDocsButton,
  );

  it("should have full guidance for using calculated overheads", calculatedGuidance);

  it("should have a Templates subheading and a link to download the spreadsheet template", () => {
    cy.get("h3").contains("Templates");
    cy.get("a").contains("Overhead calculation spreadsheet");
  });

  it("Should have an`Upload completed overhead calculation spreadsheet` subheading and file guidance", () => {
    cy.get("legend").contains("Upload completed overhead calculation spreadsheet");
    learnFiles();
  });

  it("should validate uploading without choosing a file", validateFileUpload);

  it("should reject 11 documents and show an error", rejectElevenDocsAndShowError);

  it("Should validate uploading a single file that is too large", uploadFileTooLarge);

  it(
    "Should attempt to upload three files totalling 33MB",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowLargerBatchFileUpload,
  );

  it("Should display the correct validation messaging", validationMessageCumulative);

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it(
    "Should upload a batch of 10 documents",
    { retries: 0, requestTimeout: seconds(30), responseTimeout: seconds(30) },
    allowBatchFileUpload("projectChangeRequests"),
  );

  it("Should see a success message for '10 documents have been uploaded'", () => {
    cy.getByAriaLabel("success message").contains("10 documents have been uploaded.");
  });

  it("Should display the 10 documents correctly", () =>
    displayBatchUpload("Overhead calculation spreadsheet", "James Black", true));

  it("Should navigate back to the Overheads page", () => {
    cy.clickOn("Save and return to overheads costs");
    cy.get("h2").contains("Overheads");
  });

  it("Should click 20% and save and return to costs which should not cause validation", clickTwentyPercentAndSave);

  it("Should access the Overheads section", () => navigateToCostCat("Overheads", 2));

  it(
    "Should click 'Calculated' again and access the documents upload area again without validation",
    clickCalculatedAccessDocs,
  );

  it("Should delete all documents", () => {
    for (const document of documents) {
      deleteDocument(document);
    }
  });

  it("Should save and return to Overheads and enter £10,000.00 into the calculated costs field", saveAndReturnEnter10k);

  it("Should display £10,000.00 for Overheads on the project costs", () => {
    cy.getCellFromHeaderAndRowNumber("Cost (£)", 2).contains("£10,000.00");
  });

  it("Should navigate back to Overheads and select 0% and save and return", navigateBackSelectZeroPercent);

  it("Should display £0.00 for Overheads on the project costs", () => {
    cy.getCellFromHeaderAndRowNumber("Cost (£)", 2).contains("£0.00");
  });
});
