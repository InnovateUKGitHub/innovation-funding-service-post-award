import { visitApp } from "common/visit";
import {
  navigateToDRGClaims,
  validatePage,
  proceedToDRGDocuments,
  selectFileDescription,
  drgSummaryPageValidation,
} from "./steps";

describe("Impact Management > Claim - PCF received", () => {
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
    navigateToDRGClaims,
  );

  it("Should validate the page has appropriate headers, cost table and final claim messaging", validatePage);

  it("Should proceed to the Documents section", proceedToDRGDocuments);

  it(
    "Should ensure document upload descriptions contain everything except 'project completion form'",
    selectFileDescription,
  );

  it("Should proceed to the Summary page", () => {
    cy.get("a").contains("Continue to summary").click();
    cy.get("h1").contains("Claim summary");
  });

  it("Should contain the Final claim message but not PCF guidance message", drgSummaryPageValidation);

  it("Should have the submit button enabled and ready for submitting", () => {
    cy.getByQA("button_default-qa").contains("Submit").should("be.enabled");
  });
});
