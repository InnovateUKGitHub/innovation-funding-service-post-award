import { visitApp } from "../../../common/visit";
import {
  clickCreateRequestButtonProceed,
  correctKtpMessaging,
  ktpCostsTable,
  ktpUpdateVirement,
  saveAndReturn,
} from "../steps";

import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Reallocate Costs > Creating  PCR", () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp({ path: "projects/a0E2600000kTfqTEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(() => {
    cy.deletePcr("271316");
  });

  it("Should select 'Reallocate project costs' checkbox", () => {
    cy.clickCheckBox("Reallocate project costs");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should click 'Reallocate project costs' and continue to the next page", () => {
    cy.get("a").contains("Reallocate project costs").click();
    cy.get("h1").contains("Reallocate project costs");
  });

  it("Should show the KTP email address", () => {
    cy.get("p").contains("ktpqueries@iuk.ukri.org");
  });

  it("Should select EUI Small Ent Health and follow to the next page", () => {
    cy.get("a").contains("EUI Small Ent Health (Lead)").click();
    cy.get("h1").contains("Reallocate costs");
  });

  it("Should display the correct messaging for KTP", correctKtpMessaging);

  it("Should show a table for reallocating costs and a summary table", ktpCostsTable);

  it("Should update figures and calculate the changes", ktpUpdateVirement);

  it("Should click 'Save and return to request'", () => {
    cy.getByQA("button_default-qa").contains("Save and return to reallocate project costs").click();
    cy.get("h1").contains("Reallocate project costs");
  });

  it(
    "Should then enter a zero value in the 'grant moving over financial year' field, mark as complete and return to request",
    saveAndReturn,
  );
});
