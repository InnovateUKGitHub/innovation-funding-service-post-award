export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const displayForecastTable = () => {
  ["Period", "1", "Total", "Total eligible costs", "Difference", "IAR Due", "Month", "Total"].forEach(
    forecastHeader => {
      cy.tableHeader(forecastHeader);
    },
  );
};

export const clickForecastTile = () => {
  cy.selectTile("Forecast");
};

export const clickForecastsTile = () => {
  cy.selectTile("Forecasts");
};

export const showPartnerTable = () => {
  ["Partner", "Total eligible costs", "Forecasts and costs", "Underspend", "Date of last update"].forEach(
    partnerHeader => {
      cy.tableHeader(partnerHeader);
    },
  );
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
  [
    "Labour Period 3",
    "Labour Period 4",
    "Labour Period 5",
    "Labour Period 6",
    "Labour Period 7",
    "Labour Period 8",
  ].forEach(labourField => {
    cy.getByAriaLabel(labourField).clear({ force: true }).type("111").wait(500);
  });
};

export const exceedGrantValue = () => {
  cy.get(`input[aria-label="Labour Period 3"]`).clear({ force: true }).type("34446").wait(500);
  cy.getByQA("forecasts-warning-fc-content").contains(
    "The amount you are requesting is more than the agreed costs for:",
  );
};

export const clearCostCategories = () => {
  [
    "Labour Period 3",
    "Labour Period 4",
    "Labour Period 5",
    "Labour Period 6",
    "Labour Period 7",
    "Labour Period 8",
  ].forEach(clearCost => {
    cy.getByAriaLabel(clearCost).clear({ force: true });
  });
  cy.submitButton("Submit").click();
  cy.get("h2").contains("There is a problem");
};

export const populateCategoriesZeroSubmit = () => {
  [
    "Labour Period 3",
    "Labour Period 4",
    "Labour Period 5",
    "Labour Period 6",
    "Labour Period 7",
    "Labour Period 8",
  ].forEach(populateCat => {
    cy.getByAriaLabel(populateCat).clear({ force: true }).type("0").wait(500);
  });
  cy.submitButton("Submit").click();
};
