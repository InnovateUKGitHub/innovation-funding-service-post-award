import { visitApp } from "../../../common/visit";
import { correctKtpMessaging, ktpCostsTable, ktpUpdateVirement, saveAndReturn } from "../steps";

import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > KTP > Reallocate Costs > Creating  PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kTfqTEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(() => {
    cy.deletePcr("271316");
  });

  it("Should create a Reallocate project costs PCR", () => {
    cy.createPcr("Reallocate project costs");
  });

  it("Should click 'Reallocate project costs' and continue to the next page", () => {
    cy.get("a").contains("Reallocate project costs").click();
    cy.heading("Reallocate project costs");
  });

  it("Should show the KTP email address", () => {
    cy.paragraph("ktpqueries@iuk.ukri.org");
  });

  it("Should select EUI Small Ent Health and follow to the next page", () => {
    cy.get("a").contains("EUI Small Ent Health (Lead)").click();
    cy.heading("Reallocate costs");
  });

  it("Should display the correct messaging for KTP", correctKtpMessaging);

  it("Should contain the correct guidance copy", () => {
    [
      "The knowledge base partner may vire funds between the 'Travel and subsistence' and 'Consumables' cost categories. Funds can also be vired out of these 2 categories into the 'Associate development' category. Funds cannot be vired out of the 'Associate development' category.",
      "Virements are subject to approval by the Local Management Committee (LMC).",
      "Requests for virements must be submitted online using the Innovation Funding Service and must be approved before the related costs are incurred. These requests must not be submitted after the project partnership has ended.",
    ].forEach(copy => {
      cy.paragraph(copy);
    });
  });

  it("Should validate an empty 'New total eligible costs'", () => {
    cy.getByAriaLabel("Associate Employment").clear();
    cy.clickOn("Save and return to reallocate project costs");
    cy.validationLink("Enter new total eligible costs.");
    cy.paragraph("Enter new total eligible costs.");
  });

  it("Should show a table for reallocating costs and a summary table", ktpCostsTable);

  it("Should update figures and calculate the changes", ktpUpdateVirement);

  it("Should click 'Save and return to request'", () => {
    cy.get("button").contains("Save and return to reallocate project costs").click({ force: true });
    cy.heading("Reallocate project costs");
  });

  it(
    "Should then enter a zero value in the 'grant moving over financial year' field, mark as complete and return to request",
    saveAndReturn,
  );
});
