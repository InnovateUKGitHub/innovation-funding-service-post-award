import { visitApp } from "common/visit";
import {
  manyWhenIarNeeded,
  projCostsHeaders,
  manyPartnerFinanceDetails,
  partnerFinanceHeaders,
  manyPartnerAndEligibleCostsSummary,
} from "./steps";

describe("Finance summary > Many partners", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("154870");
  });

  it("Should click the Finance summary tile", () => {
    cy.get("h2.card-link__title").contains("Finance summary").click();
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
  });

  it("Should display a page heading", () => {
    cy.heading("Finance summary");
  });

  it("Should contain the correct table headers for 'Project costs to date' table", projCostsHeaders);

  it(
    "Should display the correct partners and eligible costs in 'Project costs to date' table",
    manyPartnerAndEligibleCostsSummary,
  );

  it("Should display the 'Eligible costs claimed to date' in the 'Project costs to date' table", () => {
    ["£3,000.00", "£21,812.00"].forEach(costsClaimed => {
      cy.getByQA("ProjectCostsToDate").contains("td:nth-child(3)", costsClaimed);
    });
  });

  it("Should display the 'Percentage of eligible costs claimed to date'", () => {
    ["0.78%", "5.65%", "0.00%"].forEach(percentage => {
      cy.getByQA("ProjectCostsToDate").contains("td:nth-child(4)", percentage);
    });
  });

  it("Should display the 'Partner finance details' headings", partnerFinanceHeaders);

  it(
    "Should list the correct partners, eligible costs, funding level and remaining grant in the Partner finance details table",
    manyPartnerFinanceDetails,
  );

  it("Should show total grant approved in Partner finance details table", () => {
    cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(4)", "£1,950.00");
  });

  it("Should show when an IAR is needed", manyWhenIarNeeded);
});
