const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';

export const navigateToProject = () => {
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("CYPRESS_DO_NOT_USE_WITH_CLAIMS").click();
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

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text", { timeout: 10000 }).contains("Show all sections").click();
};
