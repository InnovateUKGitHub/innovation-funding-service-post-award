const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';

export const navigateToProject = () => {
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("CYPRESS_DO_NOT_USE_WITH_CLAIMS").click();
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const displayForecastTable = () => {
  cy.getByQA("forecast-table");
  cy.get("thead.govuk-table__head").get("tbody.govuk-table__body");
};

export const clickForecastTile = () => {
  cy.get("h2.card-link__title").contains("Forecast").click();
};

export const clickForecastsTile = () => {
  cy.get("h2.card-link__title").contains("Forecasts").click();
};

export const showPartnerTable = () => {
  cy.tableHeader("Partner");
  cy.tableHeader("Total eligible costs");
  cy.tableHeader("Forecasts and costs");
  cy.tableHeader("Underspend");
  cy.tableHeader("Date of last update");
};

export const makeClaimFC = () => {
  cy.get("a.govuk-link").contains("make a claim").click({ force: true });
  cy.getByPageQA("claimsDashboard").should("exist", { timeout: 5000 });
};

export const makeClaimPM = () => {
  cy.get("a.govuk-link").contains("make a claim").click({ force: true });
  cy.getByPageQA("allClaimsDashboard").should("exist", { timeout: 5000 });
};

export const clickEditDisplayClaim = () => {
  cy.get("a").contains("Edit", { timeout: 5000 }).click();
  cy.get("h1").contains("Costs to be claimed", { timeout: 5000 });
};

export const clickViewDisplayClaim = () => {
  cy.get("a").contains("View", { timeout: 5000 }).click();
  cy.get("h1").contains("Claim", { timeout: 5000 });
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text", { timeout: 10000 }).contains("Show all sections").click();
};
