import { visitApp } from "common/visit";
import { shouldShowProjectTitle } from "e2e/2-claims/steps";
import {
  costCatTable,
  projCostsCostHeaders,
  projCostsDownload,
  projCostsDrawdownTable,
  projCostsFileUpload,
  projCostsPeriodTable,
  projCostsSelectFileDescription,
  projCostsStatusSection,
  projCostsUploadedSection,
} from "./steps";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import { deleteDocFromArea } from "e2e/3-documents/steps";
import { Intercepts } from "common/intercepts";
const fc = "s.shuang@irc.trde.org.uk.test";

describe("Loans > Project Costs & Documents", () => {
  before(() => {
    visitApp({ asUser: fc });
    createTestFile("bigger_test", 33);
    createTestFile("11MB_1", 11);
    createTestFile("11MB_2", 11);
    createTestFile("11MB_3", 11);
    cy.navigateToProject("191431");
  });

  after(() => {
    deleteTestFile("bigger_test");
    deleteTestFile("11MB_1");
    deleteTestFile("11MB_2");
    deleteTestFile("11MB_3");
  });

  it("Should click the Project Costs tile", () => {
    cy.selectTile("Project Costs");
  });

  it("Should display the Project Costs heading and Open/Closed subheadings", () => {
    cy.heading("Claims");
    cy.get("h2").contains("Open");
    cy.get("h2").contains("Closed");
  });

  it("Should access the open Project cost", () => {
    cy.get("a").contains("Edit").click();
    cy.heading("Costs for this period");
  });

  it("Should have a backlink", () => {
    cy.backLink("Back to claims");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should display claim retention information", () => {
    cy.validationNotification(
      "Please be aware, approval of this claim will cause a percentage of your grant to be retained. Innovate UK will retain a portion of the grant value due for this project until the project is completed (as per the terms & conditions of your grant offer letter). To check your current retained balance, please see the financial summary area of your project dashboard.",
    );
  });

  it("Should show the correct table headers for cost category table", projCostsCostHeaders);

  it("Should display the cost category table for a loans project", costCatTable);

  it("Should show a drawdown table", projCostsDrawdownTable);

  it("Should display a status and comments log section", projCostsStatusSection);

  it("Should have a 'Save and return to project costs button' and click the 'Continue to costs documents' button", () => {
    cy.getByRole("button", "Save and return to project costs");
    cy.clickOn("Continue to costs documents");
  });

  it("Should display the 'Supporting evidence' heading and subheadings", () => {
    cy.heading("Supporting evidence");
    cy.get("h2").contains("Upload");
    cy.get("h2").contains("Files uploaded");
  });

  it("Should have a backlink", () => {
    cy.backLink("Back to costs to be claimed");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should test the file components", () => {
    cy.testFileComponent(
      "Sarah Shuang",
      "costs to be claimed",
      "Costs for this period",
      "Continue to costs documents",
      Intercepts.loans,
      true,
      false,
      true,
    );
  });

  it("Should ensure the File description is working correctly.", projCostsSelectFileDescription);

  it("Should upload a file", projCostsFileUpload);

  it("Should correctly display the file", projCostsUploadedSection);

  it("Should download the file", projCostsDownload);

  it("Should delete the document", deleteDocFromArea);

  it("Should have a 'Save and return to project costs' button and click the 'Continue to update forecast' button", () => {
    cy.get("a").contains("Save and return to project costs");
    cy.get("a").contains("Continue to update forecast").click();
  });

  it("Should display the Update forecast heading", () => {
    cy.heading("Update forecast");
  });
});
