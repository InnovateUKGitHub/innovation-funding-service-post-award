import { visitApp } from "common/visit";
import { summaryTotalCostsList } from "./steps";

const fc = "contact77@test.co.uk";

/**
 * The purpose of this testcase is to test the differences between SBRI and a standard CR&D claim.
 * It does not test all functionality as this is completed on other testcases.
 */
describe("Claims > SBRI > Final", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("597638");
  });

  it("Should display the correct project number and page title", () => {
    cy.getByQA("page-title-caption").contains("597638");
    cy.heading("Project overview");
  });

  it("Should access the claims tile and click into the AB Cad Services Claim", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.get("a").contains("Edit").click();
    cy.heading("Costs to be claimed");
  });

  it("Should display correct notification of grant retention", () => {
    cy.validationNotification(
      "Please be aware, approval of this claim will cause a percentage of your grant to be retained. Innovate UK will retain a portion of the grant value due for this project until the project is completed (as per the terms & conditions of your grant offer letter). To check your current retained balance, please see the financial summary area of your project dashboard.",
    );
    cy.validationNotification("This is the final claim.");
  });

  it("Should display the correct period information", () => {
    cy.get("h2").contains("Period 1");
  });

  it("Should display the correct cost categories", () => {
    let i = 1;
    [
      "Labour",
      "Overheads",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "VAT",
    ].forEach(costCat => {
      cy.get("tr")
        .eq(i++)
        .within(() => {
          cy.get("td:nth-child(1)").contains(costCat);
        });
    });
  });

  it("Should continue to claims documents page", () => {
    cy.button("Continue to claims documents").click();
    cy.heading("Claim documents");
  });

  it("Should display SBRI document guidance", () => {
    [
      "You need to complete our short survey about the project before we can make your final payment:",
      "You need to upload the following documents here:",
      "Contact your monitoring officer for more information about what you need to provide.",
    ].forEach(paragraph => {
      cy.paragraph(paragraph);
    });
    [
      "Complete our survey",
      "Download a copy of your completed survey and upload it on this page.",
      "VAT invoices with every claim by partners registered for value-added tax (VAT)",
      "non-VAT invoices with every claim by partners not registered for VAT",
      "any documents requested by your monitoring officer to support a claim",
    ].forEach(list => {
      cy.get("li").contains(list);
    });
  });

  it("Should continue to Summary page", () => {
    cy.get("a").contains("Continue to summary").click();
    cy.heading("Claim summary");
  });

  it("Should display correct guidance", () => {
    cy.paragraph(
      "In order to submit your final claim you need to submit your Project Impact questions. An email has been sent to the Finance Contact on the Project with a link to review and update the Project Impact questions.",
    );
    cy.paragraph(
      "If you need more information or help to complete your Project Impact questions, see the Project Impact guidance in the ",
    );
    cy.paragraph(". Alternatively, you can contact our customer support service by calling 0300 321 4357 or email ");
    cy.get("a").contains("Innovate UK Guidance for applicants");
    cy.get("a").contains("support@iuk.ukri.org");
  });

  it("Should display final claim notification", () => {
    cy.validationNotification("This is the final claim.");
  });

  it("Should display correct costs being claimed", summaryTotalCostsList);

  it("Should have the submit button greyed out and clicking on it does nothing", () => {
    cy.button("Submit").should("be.disabled");
  });
});
