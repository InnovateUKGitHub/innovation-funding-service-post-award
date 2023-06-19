import { visitApp } from "common/visit";
import {
  navigateToEUIClaims,
  proceedToDocuments,
  selectFileDescription,
  summaryPageValidation,
  validatePage,
} from "./steps";

describe("Impact Management > Claim - PCF not received", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("663878");
  });

  it("Should display the project dashboard including project title", () => {
    cy.get("h1").contains("Project overview");
    cy.getByQA("page-title").contains("CYPRESS_DO_NOT_USE_IMPACT_MANAGEMENT");
  });

  it(
    "Should log in as FC for EUI Small Ent Health,navigate to Claims and start editing the open claim",
    navigateToEUIClaims,
  );

  it("Should validate the page has appropriate headers, cost table and final claim messaging", validatePage);

  it("Should proceed to the Documents section", proceedToDocuments);

  it(
    "Should ensure document upload descriptions contain everything except 'project completion form'",
    selectFileDescription,
  );

  it("Should proceed to the Summary page", () => {
    cy.get("a").contains("Continue to summary").click();
    cy.get("h1").contains("Claim summary");
  });

  it("Should contain the Final claim message and PCF guidance message", summaryPageValidation);

  it("Should have the submit button greyed out and clicking on it does nothing", () => {
    cy.getByQA("button_default-qa").contains("Submit").should("be.disabled");
  });
});
