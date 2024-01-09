import { testFile, testFileABCad, testFileEUIFinance, testfileEUIProjectManager } from "common/testfileNames";

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

export const uploadToMO = () => {
  cy.fileInput(testFile);
  cy.get("select#partnerId.govuk-select").select("Innovate UK and MO only");
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
};

export const downloadMoFile = () => {
  cy.get("h3").contains("Documents shared with Innovate UK and Monitoring Officer");
  cy.readFile("cypress/documents/testfile.doc", "base64").then((base64: string) => {
    cy.get("a")
      .contains("testfile.doc")
      .invoke("attr", "href")
      .then(href => cy.downloadFile(href))
      .should(obj => {
        expect(obj.headers["content-disposition"] ?? "").to.include("testfile.doc");
        expect(obj.redirected).to.eq(false);
        expect(obj.status).to.eq(200);
        expect(obj.ok).to.eq(true);
        expect(obj.base64).to.eq(base64);
      });
  });
};

export const deleteDocFromArea = () => {
  cy.wait(500);
  cy.button("Remove").click();
  cy.button("Remove").should("be.disabled");
  cy.validationNotification(`'${testFile}' has been removed.`);
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
  cy.validationNotification("Your document has been uploaded");
};

export const pmUploadToEUI = () => {
  cy.fileInput("testfileEUIpm.doc");
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("Your document has been uploaded");
};

export const displayEUIFile = () => {
  cy.reload();
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
  cy.validationNotification("Your document has been uploaded");
};

export const displayABFile = () => {
  cy.reload();
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
  cy.validationNotification("Your document has been uploaded");
};

export const displayEUIMedFile = () => {
  cy.reload();
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
    cy.fileInput("testfile.doc");
    cy.get("select#partnerId.govuk-select").select(`Innovate UK, MO and ${selection}`);
    cy.wait(200);
    cy.get("select#description.govuk-select").select("Plans");
    cy.submitButton("Upload documents").click();
    cy.getByQA("validation-summary").should("not.exist");
    cy.validationNotification(`Your document has been uploaded`);
  });
  cy.wait(200);
  cy.heading("Project documents");
};

export const manyPartnerDocDelete = () => {
  partnersList.forEach(partner => {
    cy.get("td:nth-child(6)").contains(partner).siblings().contains("Remove").click();
    cy.button("Remove").should("be.disabled");
    cy.validationNotification(`'${testFile}' has been removed.`);
  });
};

export const fcLoginDelete = () => {
  cy.switchUserTo(fc);
  cy.selectTile("Documents");
  cy.heading("Project documents");
  cy.get("td").contains(testFileEUIFinance);
  cy.get("td").contains("Wednesday Addams of EUI Small Ent Health").siblings().contains("Remove").click();
  cy.validationNotification(`'${testFileEUIFinance}' has been removed.`);
};

export const pmLoginViewFile = () => {
  cy.switchUserTo(pm);
  cy.get("h3").contains("Documents for EUI Small Ent Health");
  cy.readFile("cypress/documents/testfileEUIfc.doc", "base64").then((base64: string) => {
    cy.getByQA("partner-documents-container")
      .contains("a", "testfileEUIfc.doc")
      .invoke("attr", "href")
      .then(href => cy.downloadFile(href))
      .should(obj => {
        expect(obj.headers["content-disposition"] ?? "").to.include("testfileEUIfc.doc");
        expect(obj.redirected).to.eq(false);
        expect(obj.status).to.eq(200);
        expect(obj.ok).to.eq(true);
        expect(obj.base64).to.eq(base64);
      });
  });
};

export const fcLoginViewFile = () => {
  cy.switchUserTo(fc);
  cy.get("h3").contains("Documents for EUI Small Ent Health");
  cy.readFile("cypress/documents/testfileEUIpm.doc", "base64").then((base64: string) => {
    cy.getByQA("partner-documents-container")
      .contains("a", "testfileEUIpm.doc")
      .invoke("attr", "href")
      .then(href => cy.downloadFile(href))
      .should(obj => {
        expect(obj.headers["content-disposition"] ?? "").to.include("testfileEUIpm.doc");
        expect(obj.redirected).to.eq(false);
        expect(obj.status).to.eq(200);
        expect(obj.ok).to.eq(true);
        expect(obj.base64).to.eq(base64);
      });
  });
};

export const pmLoginDelete = () => {
  cy.switchUserTo(pm);
  cy.get("td").contains(testfileEUIProjectManager);
  cy.get("td").contains("James Black of EUI Small Ent Health").siblings().contains("Remove").click();
  cy.validationNotification(`'${testfileEUIProjectManager}' has been removed.`);
};

export const moLoginViewFile = () => {
  cy.switchUserTo(mo);
  cy.get("h3").contains("Documents shared with Innovate UK and partners");
  cy.getByQA("partner-documents-container").contains("td", testfileEUIProjectManager);
  cy.getByQA("partner-documents-container").contains("td", testFileEUIFinance);
};

export const pmShouldNotDelete = () => {
  cy.get("td").contains("Wednesday Addams of EUI Small Ent Health").siblings().contains("Remove").should("be.disabled");
};

export const fcShouldNotDelete = () => {
  cy.get("td").contains("James Black of EUI Small Ent Health").siblings().contains("Remove").should("be.disabled");
};

export const checkABCadVisibility = () => {
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
  cy.switchUserTo("contact77@test.co.uk");
  cy.selectTile("Documents");
  cy.heading("Project documents");
  cy.get(testfileEUIProjectManager).should("not.exist");
  cy.get(testFileEUIFinance).should("not.exist");
};

export const uploadABCadFc = () => {
  cy.fileInput(testFileABCad);
  cy.wait(500);
  cy.get("select#description.govuk-select").select("Plans");
  cy.submitButton("Upload documents").click();
  cy.validationNotification("Your document has been uploaded");
};

export const abCadFcDelete = () => {
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
  cy.switchUserTo("contact77@test.co.uk");
  cy.selectTile("Documents");
  cy.heading("Project documents");
  cy.get("td").contains(testFileABCad);
  cy.get("td").contains("ken Charles of A B Cad Services").siblings().contains("Remove").click();
  cy.validationNotification(`'${testFileABCad}' has been removed.`);
};
