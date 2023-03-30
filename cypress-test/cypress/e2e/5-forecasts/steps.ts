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
    "Labour Period 2",
    "Labour Period 3",
    "Labour Period 4",
    "Labour Period 5",
    "Labour Period 6",
    "Labour Period 7",
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

export const ktpCostCats = () => {
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
  ].forEach(ktpCostCat => {
    cy.tableCell(ktpCostCat);
  });
};

export const academicCosts = () => {
  [
    "Directly incurred - Staff",
    "Directly incurred - Travel and subsistence",
    "Directly incurred - Equipment",
    "Directly incurred - Other costs",
    "Directly allocated - Investigations",
    "Directly allocated - Estates costs",
    "Directly allocated - Other costs",
    "Indirect costs - Investigations",
    "Exceptions - Staff",
    "Exceptions - Travel and subsistence",
    "Exceptions - Equipment",
    "Exceptions - Other costs",
  ].forEach(academicCosts => {
    cy.tableCell(academicCosts);
  });
  cy.tableHeader("Total");
};

export const ktpUpdateForecast = () => {
  [
    "Associate Employment Period 2",
    "Associate Employment Period 3",
    "Associate Employment Period 4",
    "Travel and subsistence Period 2",
    "Travel and subsistence Period 3",
    "Travel and subsistence Period 4",
    "Consumables Period 2",
    "Consumables Period 3",
    "Consumables Period 4",
    "Associate development Period 2",
    "Associate development Period 3",
    "Associate development Period 4",
    "Knowledge base supervisor Period 2",
    "Knowledge base supervisor Period 3",
    "Knowledge base supervisor Period 4",
    "Estate Period 2",
    "Estate Period 3",
    "Estate Period 4",
    "Indirect costs Period 2",
    "Indirect costs Period 3",
    "Indirect costs Period 4",
    "Other costs Period 2",
    "Other costs Period 3",
    "Other costs Period 4",
    "Additional associate support Period 2",
    "Additional associate support Period 3",
    "Additional associate support Period 4",
    "Subcontracting Period 2",
    "Subcontracting Period 3",
    "Subcontracting Period 4",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("100");
  });
  cy.get("td:nth-child(6)").contains("£3,000.00");
  [
    "Associate Employment Period 2",
    "Associate Employment Period 3",
    "Associate Employment Period 4",
    "Travel and subsistence Period 2",
    "Travel and subsistence Period 3",
    "Travel and subsistence Period 4",
    "Consumables Period 2",
    "Consumables Period 3",
    "Consumables Period 4",
    "Associate development Period 2",
    "Associate development Period 3",
    "Associate development Period 4",
    "Knowledge base supervisor Period 2",
    "Knowledge base supervisor Period 3",
    "Knowledge base supervisor Period 4",
    "Estate Period 2",
    "Estate Period 3",
    "Estate Period 4",
    "Indirect costs Period 2",
    "Indirect costs Period 3",
    "Indirect costs Period 4",
    "Other costs Period 2",
    "Other costs Period 3",
    "Other costs Period 4",
    "Additional associate support Period 2",
    "Additional associate support Period 3",
    "Additional associate support Period 4",
    "Subcontracting Period 2",
    "Subcontracting Period 3",
    "Subcontracting Period 4",
  ].forEach(costCat => {
    cy.getByAriaLabel(costCat).clear().type("0");
  });
  cy.wait(500);
};

export const updateAcademicCosts = () => {
  [
    "Directly incurred - Staff Period 2",
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Travel and subsistence Period 2",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Equipment Period 2",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Other costs Period 2",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly allocated - Investigations Period 2",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Estates costs Period 2",
    "Directly allocated - Estates costs Period 3",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Other costs Period 2",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Indirect costs - Investigations Period 2",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Exceptions - Staff Period 2",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Travel and subsistence Period 2",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Equipment Period 2",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Other costs Period 2",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("100");
  });
  cy.get("td:nth-child(14)").contains("£3,600.00");
  [
    "Directly incurred - Staff Period 2",
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Travel and subsistence Period 2",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Equipment Period 2",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Other costs Period 2",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly allocated - Investigations Period 2",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Estates costs Period 2",
    "Directly allocated - Estates costs Period 3",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Other costs Period 2",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Indirect costs - Investigations Period 2",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Exceptions - Staff Period 2",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Travel and subsistence Period 2",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Equipment Period 2",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Other costs Period 2",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("0");
  });
  cy.wait(500);
};
