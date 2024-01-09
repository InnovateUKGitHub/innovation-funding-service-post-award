import { seconds } from "./seconds";
import { longFile, noFileName, singleCharFile, specialCharFile, testFile } from "common/testfileNames";

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  [
    "You can upload up to 10 documents at a time. The documents must:",
    "There is no limit to the number of files you can upload in total.",
    "You can upload these file types:",
  ].forEach(para => {
    cy.paragraph(para);
  });
  [
    "total no more than 32MB in file size",
    "each have a unique file name that describes its contents",
    "PDF",
    "(pdf, xps)",
    "(doc, docx, rtf, txt, csv, odt)",
    "text",
    "presentation",
    "(ppt, pptx, odp)",
    "spreadsheet",
    "(xls, xlsx, ods)",
    "images",
    "(jpg, jpeg, png, odg)",
  ].forEach(fileInfo => {
    cy.get("li").contains(fileInfo);
  });
};

const largerDocs = ["11MB_1.txt", "11MB_2.txt", "11MB_3.txt", "testfile.doc"];

const documentPaths = largerDocs.map(doc => `cypress/documents/${doc}`);

export const allowLargerBatchFileUpload = () => {
  cy.get(`input[type="file"]`)
    .wait(seconds(1))
    .selectFile(documentPaths, { force: true, timeout: seconds(5) });
  cy.wait(seconds(1)).submitButton("Upload").trigger("focus").click();
};

//export const allowLargerBatchFileUpload = (documentType: string) => () => {
//  cy.intercept("POST", `/api/documents/${documentType}/**`).as("filesUpload");
//  cy.get(`input[type="file"]`)
//    .wait(seconds(1))
//    .selectFile(documentPaths, { force: true, timeout: seconds(5) });
//  cy.wait(seconds(1)).submitButton("Upload documents").trigger("focus").click();
//  cy.wait("@filesUpload");
//};

export const validationMessageCumulative = () => {
  cy.validationLink("You can only upload up to 32MB at the same time.");
  cy.paragraph("You can only upload up to 32MB at the same time.");
};

export const validateFileUpload = () => {
  cy.button("Upload").click();
  cy.validationLink("Choose a file to upload");
  cy.paragraph("Choose a file to upload.");
  cy.wait(500);
};

export const uploadSingleChar = () => {
  cy.fileInput(singleCharFile);
  cy.wait(500);
  cy.button("Upload documents").click();
  cy.validationNotification(`Your document has been uploaded.`);
  cy.wait(1000);
};

export const deleteSingleChar = () => {
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.tableCell("Remove").scrollIntoView().click();
    });
  cy.button("Remove").should("be.disabled");
  cy.validationNotification(`'${singleCharFile}' has been removed.`);
};

export const validateExcessiveFileName = () => {
  cy.wait(500);
  cy.fileInput(longFile);
  cy.wait(500);
  cy.button("Upload documents").click();
  cy.validationLink(`You cannot upload '${longFile}' because the name of the file must be shorter than 80 characters.`);
  cy.paragraph(`You cannot upload '${longFile}' because the name of the file must be shorter than 80 characters.`);
  cy.wait(500);
};

export const doNotUploadSpecialChar = () => {
  cy.fileInput(testFile, specialCharFile);
  cy.button("Upload documents").click();
  cy.validationLink(
    `Your document '${specialCharFile}' has failed due to the use of forbidden characters, please rename your document using only alphanumerics and a single dot.`,
  );
  cy.paragraph(
    `Your document '${specialCharFile}' has failed due to the use of forbidden characters, please rename your document using only alphanumerics and a single dot.`,
  );
  cy.wait(500);
};

export const uploadFileTooLarge = () => {
  cy.fileInput("bigger_test.txt");
  cy.button("Upload").click();
  cy.validationLink("You cannot upload 'bigger_test.txt' because it must be no larger than 32MB.");
  cy.paragraph("You cannot upload 'bigger_test.txt' because it must be no larger than 32MB.");
  cy.wait(500);
};

export const uploadFileNameTooShort = () => {
  cy.fileInput(noFileName);
  cy.button("Upload").click();
  cy.validationLink(`You cannot upload this file because the file has no name.`);
  cy.paragraph(`You cannot upload this file because the file has no name.`);
  cy.wait(500);
};

export const selectFileDescription = () => {
  [
    "Review meeting",
    "Plans",
    "Collaboration agreement",
    "Risk register",
    "Annex 3",
    "Presentation",
    "Email",
    "Meeting agenda",
  ].forEach(fileDescription => {
    cy.get("select#description.govuk-select").select(fileDescription);
  });
};

export const accessControl = () => {
  cy.get("select#partnerId.govuk-select").select("Innovate UK and MO only");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and EUI Small Ent Health");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and A B Cad Services");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and ABS EUI Medium Enterprise");
};
