import { visitApp } from "common/visit";
import {
  abCadCostsTable,
  absEuiMediumCostsTable,
  displayReasoningTab,
  euiCostsTable,
  reallocateInReviewCostsTable,
  reallocateRequestPage,
  workingForwardArrow,
} from "./reallocate-steps";

const monitoringOfficer = "testman2@testing.com";

describe("PCR > Reallocate Costs > 6- Reallocate in review", () => {
  before(() => {
    visitApp({ asUser: monitoringOfficer, path: "projects/a0EAd0000026yoLMAQ/pcrs/dashboard" });
  });

  it("Should access the Reallocate project costs PCR.", () => {
    cy.get("td").contains("Reallocate project costs").siblings().contains("a", "Review").click();
    cy.heading("Request");
  });

  it("Should display the Request page with the query and send for approval radio buttons.", reallocateRequestPage);

  it("Should access the Reallocate project costs PCR.", () => {
    cy.get("a").contains("Reallocate project costs").click();
    cy.heading("Reallocate project costs");
  });

  it("Should display the completed reallocate costs table.", reallocateInReviewCostsTable);

  it("Should display grant moving over financial year", () => {
    cy.getListItemFromKey("Grant value moving over the financial year end", "£666.66");
  });

  it("Should have a working forward arrow 'Next' with Reasoning", workingForwardArrow);

  it("Should navigate back to request", () => {
    cy.clickOn("Back to request");
    cy.heading("Request");
  });

  it("Should display the Request page with the query and send for approval radio buttons.", reallocateRequestPage);

  it("Should access the Reallocate project costs PCR.", () => {
    cy.get("a").contains("Reallocate project costs").click();
    cy.heading("Reallocate project costs");
  });

  it("Should access EUI Small Ent Health costs.", () => {
    cy.get("a").contains("EUI Small Ent Health (Lead)").click();
    cy.get("h2").contains("EUI Small Ent Health");
  });

  it("Should display the reasoning for the request", displayReasoningTab);

  it("Should display EUI costs table.", euiCostsTable);

  it("Should back out to the Summary page.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Grant value moving over the financial year end", "£666.66");
  });

  it("Should back out to the request page.", () => {
    cy.clickOn("Back to request");
    cy.heading("Request");
  });

  it("Should display the Request page with the query and send for approval radio buttons.", reallocateRequestPage);

  it("Should access the Reallocate project costs PCR.", () => {
    cy.get("a").contains("Reallocate project costs").click();
    cy.heading("Reallocate project costs");
  });

  it("Should access A B Cad Services costs", () => {
    cy.get("a").contains("A B Cad Services").click();
    cy.get("h2").contains("A B Cad Services");
  });

  it("Should display the reasoning for the request", displayReasoningTab);

  it("Should display the A B Cad costs table.", abCadCostsTable);

  it("Should back out to the Summary page.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Grant value moving over the financial year end", "£666.66");
  });

  it("Should back out to the request page.", () => {
    cy.clickOn("Back to request");
    cy.heading("Request");
  });

  it("Should display the Request page with the query and send for approval radio buttons.", reallocateRequestPage);

  it("Should access the Reallocate project costs PCR.", () => {
    cy.get("a").contains("Reallocate project costs").click();
    cy.heading("Reallocate project costs");
  });

  it("Should access ABS EUI Medium costs", () => {
    cy.get("a").contains("ABS EUI Medium Enterprise").click();
    cy.get("h2").contains("ABS EUI Medium Enterprise");
  });

  it("Should display the reasoning for the request", displayReasoningTab);

  it("Should display the ABS EUI costs table.", absEuiMediumCostsTable);

  it("Should back out to the Summary page.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Grant value moving over the financial year end", "£666.66");
  });

  it("Should back out to the request page.", () => {
    cy.clickOn("Back to request");
    cy.heading("Request");
  });

  it("Should display the Request page with the query and send for approval radio buttons.", reallocateRequestPage);
});
