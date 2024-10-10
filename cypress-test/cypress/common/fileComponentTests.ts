import { uploadDate } from "e2e/2-claims/steps";
import { seconds } from "./seconds";
import { emptyFileName, longFile, noFileName, singleCharFile, specialCharFile, testFile } from "common/testfileNames";
import { Heading } from "typings/headings";

const largerDocs = ["11MB_1.txt", "11MB_2.txt", "11MB_3.txt", "testfile.doc"];

const largeDocumentPaths = largerDocs.map(doc => `cypress/documents/${doc}`);

export const documents = [
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
];

const documentPaths = documents.map(doc => `cypress/documents/${doc}`);

export const allowBatchFileUpload = (documentType: string, jsDisabled?: boolean) => () => {
  if (jsDisabled) {
    cy.log("No intercept as js-disabled");
  } else {
    cy.intercept("POST", `/api/documents/${documentType}/**`).as("filesUpload");
  }
  cy.get(`input[type="file"]`)
    .wait(seconds(1))
    .selectFile(documentPaths, { force: true, timeout: seconds(5) });
  cy.wait(seconds(1)).submitButton("Upload documents").trigger("focus").click();
  if (jsDisabled) {
    cy.wait(500);
  } else {
    cy.wait("@filesUpload");
  }
};

export const displayBatchUpload = (documentType: string, user: string, removeButton: boolean) => {
  documents.forEach(document => {
    cy.contains("td", document)
      .parent()
      .within(() => {
        cy.tableCell(document);
        cy.tableCell(documentType);
        cy.tableCell(uploadDate);
        cy.tableCell("0KB");
        cy.tableCell(user);
        if (removeButton) {
          cy.button("Remove");
        }
      });
  });
};

export const allowLargerBatchFileUpload = () => {
  cy.get(`input[type="file"]`)
    .wait(seconds(1))
    .selectFile(largeDocumentPaths, { force: true, timeout: seconds(5) });
  cy.wait(seconds(1)).submitButton("Upload").trigger("focus").click();
};

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

export const checkFileUploadSuccessDisappears = (suffix: string, headerAssertion: Heading) => {
  cy.backLink(`Back to ${suffix}`).click();
  cy.heading(headerAssertion);
  cy.get("main").within(() => {
    cy.getByQA("validation-message-content").should("not.exist");
  });
};

export const deleteSingleChar = () => {
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.tableCell("Remove").scrollIntoView().click();
    });
  cy.validationNotification(`'${singleCharFile}' has been removed.`);
};

export const validateExcessiveFileName = () => {
  cy.wait(500);
  cy.fileInput(longFile);
  cy.wait(500);
  cy.button("Upload documents").click();
  cy.validationLink(`The selected file name must be 80 characters or less.`);
  cy.paragraph(`The selected file name must be 80 characters or less.`);
  cy.wait(500);
};

export const doNotUploadSpecialChar = () => {
  cy.fileInput(testFile, specialCharFile);
  cy.button("Upload documents").click();
  cy.validationLink("The selected file name cannot use *, <, >, :, / and ? characters.");
  cy.paragraph("The selected file name cannot use *, <, >, :, / and ? characters.");
  cy.wait(500);
};

export const uploadFileTooLarge = () => {
  cy.fileInput("bigger_test.txt");
  cy.button("Upload").click();
  cy.validationLink("The selected file must be no larger than 32MB.");
  cy.paragraph("The selected file must be no larger than 32MB.");
  cy.wait(500);
};

export const uploadFileNameTooShort = () => {
  cy.fileInput(emptyFileName);
  cy.button("Upload").click();
  cy.validationLink(`The selected file name must not begin with a space.`);
  cy.paragraph(`The selected file name must not begin with a space.`);
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

export const rejectElevenDocsAndShowError = () => {
  const tooManyDocuments = [...documentPaths, "cypress/documents/testfile.doc"];
  cy.get(`input[type="file"]`).selectFile(tooManyDocuments);
  cy.clickOn("button", "Upload documents");
  cy.getByRole("alert").contains("You can only select up to 10 files at the same time.");
  cy.wait(1000);
};

export const deleteDocument = (document: string) => {
  cy.get("tr").then($tr => {
    if ($tr.text().includes(document)) {
      cy.log(`Deleting existing ${document} document`);
      cy.tableCell(document).parent().siblings().contains("button", "Remove").click({ force: true });
      cy.button("Remove").should("be.disabled");
      cy.getByAriaLabel("success message").contains(`'${document}' has been removed.`);
    }
  });
};
