import { visitApp } from "common/visit";
import {
  eligibleCostsSummary,
  manyWhenIarNeeded,
  manyPartnerSummary,
  projCostsHeaders,
  manyPartnerFinanceDetails,
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
    cy.get("h1").contains("Finance summary");
  });

  it("Should contain the correct table headers for 'Project costs to date' table", projCostsHeaders);

  it("Should display the correct partners in 'Project costs to date' table", manyPartnerSummary);

  it("Should display the correct eligible costs in 'Project costs to date' table", eligibleCostsSummary);

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

  it("Should display the 'Partner finance details' headings", () => {
    [
      "Total eligible costs",
      "Funding level",
      "Total grant approved",
      "Remaining grant",
      "Total grant paid in advance",
      "Claim cap",
    ].forEach(headers => {
      cy.getByQA("PartnerFinanceDetails").contains("th", headers);
    });
  });

  it("Should list the correct partners in the Partner finance details table", manyPartnerFinanceDetails);

  it("Should display eligible costs in the Partner finance details table", () => {
    [
      "£384,000.00",
      "£386,000.00",
      "£385,000.00",
      "£381,000.00",
      "£387,220.00",
      "£420,000.00",
      "£388,000.00",
      "£35,000.00",
      "£390,000.00",
      "£416,000.00",
      "£389,000.00",
      "£414,000.00",
      "£400,000.00",
      "£267,160.50",
      "£1,010,000.00",
      "£372,000.00",
      "£550,000.00",
      "£396,000.00",
      "£355,000.00",
      "£450,000.00",
      "£440,000.00",
      "£385,000.00",
      "£404,000.00",
      "£416,000.00",
      "£420,000.00",
      "£413,000.00",
      "£360,000.00",
      "£470,000.00",
      "£485,000.00",
      "£429,000.00",
      "£389,000.00",
      "£735,000.00",
    ].forEach(manyProjCost => {
      cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(2)", manyProjCost);
    });
  });

  it("Should display the funding level on Partner finance details table", () => {
    [
      "65.00%",
      "66.00%",
      "67.00%",
      "68.00%",
      "69.00%",
      "70.00%",
      "71.00%",
      "72.00%",
      "73.00%",
      "74.00%",
      "75.00%",
      "76.00%",
      "77.00%",
      "78.00%",
      "79.00%",
      "80.00%",
      "81.00%",
      "82.00%",
      "83.00%",
      "84.00%",
      "85.00%",
      "86.00%",
      "87.00%",
      "88.00%",
      "89.00%",
      "90.00%",
      "91.00%",
      "92.00%",
      "93.00%",
      "94.00%",
      "95.00%",
      "96.11%",
    ].forEach(fundLevel => {
      cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(3)", fundLevel);
    });
  });

  it("Should show when an IAR is needed", manyWhenIarNeeded);
});
