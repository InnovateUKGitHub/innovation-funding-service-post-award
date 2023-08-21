const pm = "james.black@euimeabs.test";
const fc = "wed.addams@test.test.co.uk";
const mo = "testman2@testing.com";

const partnersList = [
  "EUI Small Ent Health",
  "A B Cad Services",
  "ABS EUI Medium Enterprise",
  "Auto Corporation Ltd",
  "Auto Healthcare Ltd",
  "Auto Monitoring Ltd",
  "Auto Research Ltd",
  "Brown and co",
  "Deep Rock Galactic",
  "EUI Micro Research Co.",
  "Gorcium Management Services Ltd.",
  "Hyperion Corporation",
  "Image Development Society",
  "Intaser",
  "Jakobs",
  "Java Coffee Inc",
  "Lutor Systems",
  "Maliwan",
  "Munce Inc",
  "National Investment Bank",
  "NIB Reasearch Limited",
  "RBA Test Account 1",
  "Red Motor Research Ltd.",
  "Swindon Development University",
  "Swindon University",
  "The Best Manufacturing",
  "Top Castle Co.",
  "UAT37",
  "University of Bristol",
  "Vitruvius Stonework Limited",
  "YHDHDL",
  "Hedges' Hedges Ltd",
];

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
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

export const learnAboutFiles = () => {
  cy.get("span.govuk-details__summary-text").contains("Learn more about files you can upload").click();
  ["You can upload up to 10 documents", "There is no limit", "upload these file types"].forEach(note => {
    cy.paragraph(note);
  });
  [
    "less than 32MB",
    "unique file name",
    "PDF (pdf, xps)",
    "text (doc, docx, rtf, txt, csv, odt)",
    "presentation (ppt, pptx, odp)",
    "spreadsheet (xls, xlsx, ods)",
    "images (jpg, jpeg, png, odg)",
  ].forEach(fileItem => {
    cy.list(fileItem);
  });
};

export const uploadToMO = () => {
  cy.fileInput("testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK and MO only");
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
};

export const displayMOFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and Monitoring Officer");
  cy.reload();
  cy.getByQA("project-documents-container").within(() => {
    cy.tableCell("testfile.doc");
  });
};

export const deleteDocFromArea = () => {
  cy.button("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const uploadToEUI = () => {
  cy.fileInput("testfile.doc");
  cy.wait(500);
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and EUI Small Ent Health");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
};

export const fcUploadToEUI = () => {
  cy.fileInput("testfileEUIfc.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded");
};

export const pmUploadToEUI = () => {
  cy.fileInput("testfileEUIpm.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded");
};

export const displayEUIFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and partners");
  cy.reload();
  cy.getByQA("partner-documents-container").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(6)").contains("EUI Small Ent Health");
      });
  });
};

export const uploadToAB = () => {
  cy.fileInput("testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and A B Cad Services");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded");
};

export const displayABFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
  cy.reload();
  cy.getByQA("partner-documents-container").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(6)").contains("A B Cad Services");
      });
  });
};

export const uploadToEUIMed = () => {
  cy.fileInput("testfile.doc");
  cy.get("select#partnerId.govuk-select").select("Innovate UK, MO and ABS EUI Medium Enterprise");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded");
};

export const displayEUIMedFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
  cy.wait(500);
  cy.reload();
  cy.getByQA("partner-documents-container").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(6)").contains("ABS EUI Medium Enterprise");
      });
  });
};

export const manyPartnerUpload = () => {
  partnersList.forEach(selection => {
    cy.get("input#attachment.govuk-file-upload").wait(500).selectFile("cypress/common/testfile.doc");
    cy.get("select#partnerId.govuk-select").select(`Innovate UK, MO and ${selection}`);
    cy.wait(500);
    cy.get("select#description.govuk-select").select("Plans");
    cy.submitButton("Upload documents").click();
    cy.getByQA("validation-summary").should("not.exist");
    cy.getByQA("validation-message-content").contains("has been uploaded");
  });
  cy.reload();
  cy.heading("Project documents");
};

export const manyPartnerDocDelete = () => {
  partnersList.forEach(partner => {
    cy.get("td:nth-child(6)").contains(partner).siblings().contains("Remove").click();
    cy.getByQA("validation-message-content").contains("has been deleted.");
    cy.wait(800);
  });
};

export const fcLoginDelete = () => {
  cy.switchUserTo(fc);
  cy.selectTile("Documents");
  cy.heading("Project documents");
  cy.get("td").contains("testfileEUIfc.doc");
  cy.get("td").contains("Wednesday Addams of EUI Small Ent Health").siblings().contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const pmLoginViewFile = () => {
  cy.switchUserTo(pm);
  cy.get("h3").contains("Documents for EUI Small Ent Health");
  cy.getByQA("partner-documents-container").contains("td", "testfileEUIfc.doc");
};

export const fcLoginViewFile = () => {
  cy.switchUserTo(fc);
  cy.get("h3").contains("Documents for EUI Small Ent Health");
  cy.getByQA("partner-documents-container").contains("td", "testfileEUIpm.doc");
  cy.get("body").contains("documentUploadedByIUK.docx").should("not.exist");
};

export const pmLoginDelete = () => {
  cy.switchUserTo(pm);
  cy.get("td").contains("testfileEUIpm.doc");
  cy.get("td").contains("James Black of EUI Small Ent Health").siblings().contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const moLoginViewFile = () => {
  cy.switchUserTo(mo);
  cy.get("h3").contains("Documents shared with Innovate UK and partners");
  cy.getByQA("partner-documents-container").contains("td", "testfileEUIpm.doc");
  cy.getByQA("partner-documents-container").contains("td", "testfileEUIfc.doc");
};

export const pmShouldNotDelete = () => {
  cy.get("td").contains("Wednesday Addams of EUI Small Ent Health").siblings().contains("Remove").should("be.disabled");
};

export const fcShouldNotDelete = () => {
  cy.get("td").contains("James Black of EUI Small Ent Health").siblings().contains("Remove").should("be.disabled");
};

export const validateFileUpload = () => {
  cy.button("Upload").click();
  cy.validationLink("Choose a file to upload");
  cy.reload();
};

export const uploadSingleChar = () => {
  cy.fileInput("T.doc");
  cy.button("Upload documents").click();
  cy.getByQA("validation-message-content").contains("has been uploaded.");
};

export const deleteSingleChar = () => {
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.tableCell("Remove").scrollIntoView().click();
    });
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const validateExcessiveFileName = () => {
  cy.fileInput("Specialcharhellothisissuperlongsowonderingifthisbailsoutinsalesforcebecausewowth1.docx");
  cy.button("Upload documents").click();
  cy.validationLink(
    "You cannot upload 'Specialcharhellothisissuperlongsowonderingifthisbailsoutinsalesforcebecausewowth1.docx' because the name of the file must be shorter than 80 characters.",
  );
  cy.reload();
};

export const doNotUploadSpecialChar = () => {
  cy.fileInput("specialchar@)(*&^%$£!#}{.doc");
  cy.button("Upload documents").click();
  cy.validationLink(
    "Your document 'specialchar@)(*&^%$£!#}{.doc' has failed due to the use of forbidden characters, please rename your document using only alphanumerics and a single dot.",
  );
  cy.reload();
};

export const uploadFileTooLarge = () => {
  cy.fileInput("bigger_test.txt");
  cy.button("Upload documents").click();
  cy.validationLink("You cannot upload 'bigger_test.txt' because it must be smaller than 32MB.");
  cy.reload();
};

export const uploadFileNameTooShort = () => {
  cy.fileInput(".txt");
  cy.button("Upload").click();
  cy.validationLink("You cannot upload '.txt' because the file must have a name.");
  cy.get("p").contains("You cannot upload '.txt' because the file must have a name.");
  cy.reload();
};

export const checkABCadVisibility = () => {
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
  cy.switchUserTo("contact77@test.co.uk");
  cy.selectTile("Documents");
  cy.heading("Project documents");
  cy.get("testfileEUIpm.doc").should("not.exist");
  cy.get("testfileEUIfc.doc").should("not.exist");
};

export const uploadABCadFc = () => {
  cy.fileInput("testfileABCadFc.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded");
};

export const abCadFcDelete = () => {
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
  cy.switchUserTo("contact77@test.co.uk");
  cy.selectTile("Documents");
  cy.heading("Project documents");
  cy.get("td").contains("testfileABCadFc.doc");
  cy.get("td").contains("ken Charles of A B Cad Services").siblings().contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};
