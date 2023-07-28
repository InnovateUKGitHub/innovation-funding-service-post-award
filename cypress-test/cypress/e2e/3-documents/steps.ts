const pm = "james.black@euimeabs.test";
const fc = "wed.addams@test.test.co.uk";
const mo = "testman2@testing.com";

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
  cy.fileInput("testfilefc.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
};

export const pmUploadToEUI = () => {
  cy.fileInput("testfilepm.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
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
};

export const displayEUIMedFile = () => {
  cy.get("h3").contains("Innovate UK and partners");
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
  [
    "Innovate UK, MO and EUI Small Ent Health",
    "Innovate UK, MO and A B Cad Services",
    "Innovate UK, MO and ABS EUI Medium Enterprise",
    "Innovate UK, MO and Auto Corporation Ltd",
    "Innovate UK, MO and Auto Healthcare Ltd",
    "Innovate UK, MO and Auto Monitoring Ltd",
    "Innovate UK, MO and Auto Research Ltd",
    "Innovate UK, MO and Brown and co",
    "Innovate UK, MO and Deep Rock Galactic",
    "Innovate UK, MO and EUI Micro Research Co.",
    "Innovate UK, MO and Gorcium Management Services Ltd.",
    "Innovate UK, MO and Hyperion Corporation",
    "Innovate UK, MO and Image Development Society",
    "Innovate UK, MO and Intaser",
    "Innovate UK, MO and Jakobs",
    "Innovate UK, MO and Java Coffee Inc",
    "Innovate UK, MO and Lutor Systems",
    "Innovate UK, MO and Maliwan",
    "Innovate UK, MO and Munce Inc",
    "Innovate UK, MO and National Investment Bank",
    "Innovate UK, MO and NIB Reasearch Limited",
    "Innovate UK, MO and RBA Test Account 1",
    "Innovate UK, MO and Red Motor Research Ltd.",
    "Innovate UK, MO and Swindon Development University",
    "Innovate UK, MO and Swindon University",
    "Innovate UK, MO and The Best Manufacturing",
    "Innovate UK, MO and Top Castle Co.",
    "Innovate UK, MO and UAT37",
    "Innovate UK, MO and University of Bristol",
    "Innovate UK, MO and Vitruvius Stonework Limited",
    "Innovate UK, MO and YHDHDL",
    "Innovate UK, MO and Hedges' Hedges Ltd",
  ].forEach(selection => {
    cy.fileInput("testfile.doc");
    cy.get("select#partnerId.govuk-select").select(selection);
    cy.get("select#description.govuk-select").select("Plans");
    cy.submitButton("Upload documents").click();
    cy.getByQA("validation-summary").should("not.exist");
    cy.getByQA("validation-message-content").contains("has been uploaded");
  });
  cy.reload();
  cy.heading("Project documents");
};

export const manyPartnerDocDelete = () => {
  [
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
  ].forEach(partner => {
    cy.get("td:nth-child(6)").contains(partner).siblings().contains("Remove").click();
    cy.getByQA("validation-message-content").contains("has been deleted.");
    cy.wait(800);
  });
};

export const fcLoginDelete = () => {
  cy.switchUserTo(fc);
  cy.get("td").contains("testfilefc.doc");
  cy.get("td").contains("Wednesday Addams of EUI Small Ent Health").siblings().contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const pmLoginViewFile = () => {
  cy.switchUserTo(pm);
  cy.get("h3").contains("Documents for EUI Small Ent Health");
  cy.getByQA("partner-documents-container").contains("td", "testfilefc.doc");
};

export const fcLoginViewFile = () => {
  cy.switchUserTo(fc);
  cy.get("h3").contains("Documents for EUI Small Ent Health");
  cy.getByQA("partner-documents-container").contains("td", "testfilepm.doc");
};

export const pmLoginDelete = () => {
  cy.switchUserTo(pm);
  cy.get("td").contains("testfilepm.doc");
  cy.get("td").contains("James Black of EUI Small Ent Health").siblings().contains("Remove").click();
  cy.getByQA("validation-message-content").contains("has been deleted.");
};

export const moLoginViewFile = () => {
  cy.switchUserTo(mo);
  cy.get("h3").contains("Documents shared with Innovate UK and partners");
  cy.getByQA("partner-documents-container").contains("td", "testfilepm.doc");
  cy.getByQA("partner-documents-container").contains("td", "testfilefc.doc");
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
