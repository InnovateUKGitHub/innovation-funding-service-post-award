const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';

export const navigateToProject = () => {
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("1_CYPRESS_DO_NOT_USE").click({ force: true });
};

export const navigateToProjectWithClaims = () => {
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("CYPRESS_DO_NOT_USE_WITH_CLAIMS").click();
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const displayForecastTable = () => {
  cy.tableHeader("Period");
  cy.tableHeader("1");
  cy.tableHeader("Total");
  cy.tableHeader("Total eligible costs");
  cy.tableHeader("Difference");
  cy.tableHeader("IAR Due");
  cy.tableHeader("Month");
  cy.tableHeader("Total");
  cy.tableHeader;
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
  cy.getByPageQA("claimsDashboard").should("exist");
};

export const makeClaimPM = () => {
  cy.get("a.govuk-link").contains("make a claim").click({ force: true });
  cy.getByPageQA("allClaimsDashboard").should("exist");
};

export const clickEditDisplayClaim = () => {
  cy.get("a").contains("Edit").click();
  cy.get("h1").contains("Costs to be claimed");
};

export const clickViewDisplayClaim = () => {
  cy.get("a").contains("View").click();
  cy.get("h1").contains("Claim");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const updateLabourFields = () => {
  cy.getByAriaLabel("Labour Period 3").clear({ force: true }).type("111").wait(500);
  cy.getByAriaLabel("Labour Period 4").clear({ force: true }).type("111").wait(500);
  cy.getByAriaLabel("Labour Period 5").clear({ force: true }).type("111").wait(500);
  cy.getByAriaLabel("Labour Period 6").clear({ force: true }).type("111").wait(500);
  cy.getByAriaLabel("Labour Period 7").clear({ force: true }).type("111").wait(500);
  cy.getByAriaLabel("Labour Period 8").clear({ force: true }).type("111").wait(500);
};

export const exceedGrantValue = () => {
  cy.get(`input[aria-label="Labour Period 3"]`).clear({ force: true }).type("34446").wait(500);
  cy.getByQA("forecasts-warning-fc-content").contains(
    "The amount you are requesting is more than the agreed costs for:",
  );
};

export const clearCostCategories = () => {
  cy.getByAriaLabel("Labour Period 3").clear({ force: true });
  cy.getByAriaLabel("Labour Period 4").clear({ force: true });
  cy.getByAriaLabel("Labour Period 5").clear({ force: true });
  cy.getByAriaLabel("Labour Period 6").clear({ force: true });
  cy.getByAriaLabel("Labour Period 7").clear({ force: true });
  cy.getByAriaLabel("Labour Period 8").clear({ force: true });
  cy.submitButton("Submit").click();
  cy.get("h2").contains("There is a problem");
};

export const populateCategoriesZeroSubmit = () => {
  cy.getByAriaLabel("Labour Period 3").clear({ force: true }).type("0").wait(500);
  cy.getByAriaLabel("Labour Period 4").clear({ force: true }).type("0").wait(500);
  cy.getByAriaLabel("Labour Period 5").clear({ force: true }).type("0").wait(500);
  cy.getByAriaLabel("Labour Period 6").clear({ force: true }).type("0").wait(500);
  cy.getByAriaLabel("Labour Period 7").clear({ force: true }).type("0").wait(500);
  cy.getByAriaLabel("Labour Period 8").clear({ force: true }).type("0").wait(500);
  cy.submitButton("Submit").click();
};
