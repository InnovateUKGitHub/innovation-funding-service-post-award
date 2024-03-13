import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { reallocateCostsGiveUsInfoContinue } from "../steps";

const projManager = "james.black@euimeabs.test";

describe("PCR > Reallocate Costs > 5 - Change remaining grant", () => {
  before(() => {
    visitApp({ asUser: projManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Reallocate Partner costs PCR", () => {
    cy.createPcr("Reallocate project costs");
  });

  it("Should select 'Give us information' and continue to the next page", reallocateCostsGiveUsInfoContinue);

  it("Should access the 'Change remaining grant section", () => {
    cy.clickOn("Change remaining grant");
    cy.heading("Change remaining grant");
  });

  it("Should change partner grants while keeping the same total and ensure they save correctly", () => {
    [
      ["227333.33", "113633.33", "933.34"],
      ["227866.33", "113133.33", "900.34"],
      ["227866.13", "113133.23", "900.64"],
      ["227866.13", "113133.03", "900.84"],
      ["227866.88", "113133.12", "900"],
      ["227866.77", "113133.13", "900.10"],
      ["227866.73", "113133.13", "900.14"],
      ["227866.13", "113133.03", "900.84"],
      ["227866.99", "113133.01", "900"],
      ["227866.56", "113133.51", "899.93"],
      ["227777.56", "113233.51", "888.93"],
    ].forEach(([euiVal, aBCadVal, aBSEuiVal], index) => {
      cy.log(`**Attempt number ${index + 1}**`);
      cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type(euiVal);
      cy.wait(500);
      cy.getByAriaLabel("A B Cad Services new remaining grant").clear().type(aBCadVal);
      cy.wait(500);
      cy.getByAriaLabel("ABS EUI Medium Enterprise new remaining grant").clear().type(aBSEuiVal);
      cy.wait(500);
      cy.get("tfoot").within(() => {
        cy.get("th:nth-child(6)").contains("£341,900.00");
        cy.get("th:nth-child(7)").contains("65.00%");
      });
      cy.clickOn("Save and return to reallocate project costs");
      cy.get("legend").contains("Grant value moving over the financial year end");
      cy.wait(500);
      cy.clickOn("Change remaining grant");
      cy.heading("Change remaining grant");
      cy.wait(500);
    });
  });
});
