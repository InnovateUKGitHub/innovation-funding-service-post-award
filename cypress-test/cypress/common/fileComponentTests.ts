import { seconds } from "./seconds";

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

export const allowLargerBatchFileUpload = (documentType: string) => () => {
  cy.intercept("POST", `/api/documents/${documentType}/**`).as("filesUpload");
  cy.get(`input[type="file"]`)
    .wait(seconds(1))
    .selectFile(documentPaths, { force: true, timeout: seconds(5) });
  cy.wait(seconds(1)).submitButton("Upload documents").trigger("focus").click();
  cy.wait("@filesUpload");
};

export const validationMessageCumulative = () => {
  cy.validationLink("You can only upload up to 32MB at the same time.");
  cy.paragraph("You can only upload up to 32MB at the same time.");
};
