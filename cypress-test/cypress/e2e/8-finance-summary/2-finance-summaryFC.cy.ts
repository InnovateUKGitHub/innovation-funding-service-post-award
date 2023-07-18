import { visitApp } from "common/visit";
import {
  dashboardAsFC,
  fcValidateCostsCheckForPartners,
  fcValidateCostsToDate,
  fcValidateFinancesCheckForPartners,
  fcValidateIARCheckForPartners,
} from "./steps";

const fcOne = "contact77@test.co.uk";
describe("Finance summary > As Finance Contact", () => {
  before(() => {
    visitApp({ asUser: fcOne });
    cy.navigateToProject("328407");
  });

  it("Should display the main dashboard as Finance Contact", dashboardAsFC);

  it("Should validate the costs to date", fcValidateCostsToDate);

  it("Should click into the Finance summary tile", () => {
    cy.selectTile("Finance summary");
    cy.heading("Finance summary");
  });

  it(
    "Should validate the 'Project costs to date' and check no other partner is visible",
    fcValidateCostsCheckForPartners,
  );

  it(
    "Should validate the 'Partner finance details' table and check no other partner is visible",
    fcValidateFinancesCheckForPartners,
  );

  it(
    "Should validate the 'Independent accountant's report' section and check no other partner is visible",
    fcValidateIARCheckForPartners,
  );
});
