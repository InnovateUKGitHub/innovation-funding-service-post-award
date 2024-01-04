import { visitApp } from "common/visit";
import {
  accessABCadClaim,
  impactGuidance,
  grantRetentionMessage,
  sbriCostCats,
  sbriFinalDocGuidance,
  summaryTotalCostsList,
} from "./steps";

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

  it("Should access the claims tile and click into the AB Cad Services Claim", accessABCadClaim);

  it("Should display correct notification of grant retention", grantRetentionMessage);

  it("Should display the correct period information", () => {
    cy.get("h2").contains("Period 1");
  });

  it("Should display the correct cost categories", sbriCostCats);

  it("Should continue to claims documents page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should display SBRI document guidance", sbriFinalDocGuidance);

  it("Should continue to Summary page", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should display final claim notification", () => {
    cy.validationNotification("This is the final claim.");
  });

  it("Should display correct costs being claimed", summaryTotalCostsList);

  it("Should have an enabled submit button but clicking it throws a PCF error", () => {
    cy.button("Submit").click();
    cy.validationLink("You must upload a project completion form before you can submit this claim.");
  });
});
