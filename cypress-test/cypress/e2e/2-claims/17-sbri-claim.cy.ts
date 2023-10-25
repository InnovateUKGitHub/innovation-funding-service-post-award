import { visitApp } from "common/visit";

const fc = "s.shuang@irc.trde.org.uk.test";

/**
 * The purpose of this testcase is to test the differences between SBRI and a standard CR&D claim.
 * It does not test all functionality as this is completed on other testcases.
 */
describe("Claims > SBRI > Documents & Forecast", () => {
  before(() => {
    visitApp({ asUser: fc });
    cy.navigateToProject("597638");
  });

  it("Should display the correct project number and page title", () => {
    cy.getByQA("page-title-caption").contains("597638");
    cy.heading("Project overview");
  });

  it("Should access the claims tile and display the correct VAT messaging and click into the ABS Claim", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
    cy.paragraph(
      "You must upload an invoice with every claim. VAT invoices are required from partners registered for value-added tax (VAT).",
    );
    cy.get("a").contains("Edit").click();
    cy.heading("Costs to be claimed");
  });

  it("Should continue to the documents page", () => {
    cy.button("Continue to claims documents").click();
    cy.heading("Claim documents");
  });

  it("Should display correct VAT messaging around doc uploads", () => {
    cy.paragraph("You need to upload the following documents here:");
    cy.paragraph("Contact your monitoring officer for more information about what you need to provide.");
    [
      "VAT invoices with every claim by partners registered for value-added tax (VAT)",
      "non-VAT invoices with every claim by partners not registered for VAT",
      "any documents requested by your monitoring officer to support a claim",
    ].forEach(list => {
      cy.get("li").contains(list);
    });
  });

  it("Should continue to the forecast page", () => {
    cy.get("a").contains("Continue to update forecast").click();
    cy.heading("Update forecast");
  });

  it("Should display 'last chance to change the forecast' message", () => {
    cy.validationNotification("This is your last chance to change the forecast for period 2");
  });

  it("Should display correct forecast cost categories for SBRI", () => {
    let i = 4;
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

  it("Should continue to the summary page", () => {
    cy.button("Continue to summary").click();
    cy.heading("Claim summary");
  });
});
