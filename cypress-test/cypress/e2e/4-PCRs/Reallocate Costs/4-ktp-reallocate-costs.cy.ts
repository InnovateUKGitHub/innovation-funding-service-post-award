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
