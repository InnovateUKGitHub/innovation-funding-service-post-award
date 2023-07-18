export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const displayForecastTableCostCategories = () => {
  let tableRow = 3;
  [
    "Labour",
    "Overheads",
    "Materials",
    "Capital usage",
    "Subcontracting",
    "Travel and subsistence",
    "Other costs",
    "Other costs 2",
    "Other costs 3",
    "Other costs 4",
    "Other costs 5",
  ].forEach(costcat => {
    tableRow++;
    cy.get("tr")
      .eq(tableRow)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costcat);
      });
  });
  cy.get("tr")
    .eq(15)
    .within(() => {
      cy.get("th:nth-child(1)").contains("Total");
    });
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
  cy.heading("Costs to be claimed");
};

export const clickViewDisplayClaim = () => {
  cy.get("a").contains("View").click();
  cy.heading("Claim");
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
  cy.get("a").contains("Update forecast").click();
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
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Staff Period 5",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Travel and subsistence Period 5",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Equipment Period 5",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly incurred - Other costs Period 5",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Investigations Period 5",
    "Directly allocated - Estates costs Period 3",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Estates costs Period 5",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Directly allocated - Other costs Period 5",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Indirect costs - Investigations Period 5",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Staff Period 5",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Travel and subsistence Period 5",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Equipment Period 5",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
    "Exceptions - Other costs Period 5",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("100");
  });
  cy.get("td:nth-child(14)").contains("£52,600.00");
  [
    "Directly incurred - Staff Period 3",
    "Directly incurred - Staff Period 4",
    "Directly incurred - Staff Period 5",
    "Directly incurred - Travel and subsistence Period 3",
    "Directly incurred - Travel and subsistence Period 4",
    "Directly incurred - Travel and subsistence Period 5",
    "Directly incurred - Equipment Period 3",
    "Directly incurred - Equipment Period 4",
    "Directly incurred - Equipment Period 5",
    "Directly incurred - Other costs Period 3",
    "Directly incurred - Other costs Period 4",
    "Directly incurred - Other costs Period 5",
    "Directly allocated - Investigations Period 3",
    "Directly allocated - Investigations Period 4",
    "Directly allocated - Investigations Period 5",
    "Directly allocated - Estates costs Period 3",
    "Directly allocated - Estates costs Period 4",
    "Directly allocated - Estates costs Period 5",
    "Directly allocated - Other costs Period 3",
    "Directly allocated - Other costs Period 4",
    "Directly allocated - Other costs Period 5",
    "Indirect costs - Investigations Period 3",
    "Indirect costs - Investigations Period 4",
    "Indirect costs - Investigations Period 5",
    "Exceptions - Staff Period 3",
    "Exceptions - Staff Period 4",
    "Exceptions - Staff Period 5",
    "Exceptions - Travel and subsistence Period 3",
    "Exceptions - Travel and subsistence Period 4",
    "Exceptions - Travel and subsistence Period 5",
    "Exceptions - Equipment Period 3",
    "Exceptions - Equipment Period 4",
    "Exceptions - Equipment Period 5",
    "Exceptions - Other costs Period 3",
    "Exceptions - Other costs Period 4",
    "Exceptions - Other costs Period 5",
  ].forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("0");
  });
  cy.wait(500);
};

export const submitCalculations = () => {
  cy.tableCell("£33,999.00");
  cy.get("button").contains("Submit").click();
  cy.get("a").contains("Update forecast");
  cy.get("td:nth-child(4)").contains("111");
  cy.get("td:nth-child(14)").contains("£33,999.00");
};

export const clickForecastAccessEUI = () => {
  cy.selectTile("Forecasts");
  cy.get("td").contains("EUI Small Ent Health").siblings().contains("View forecast").click();
};

export const clickUpdateForecastButton = () => {
  cy.heading("Forecast");
  cy.get("a").contains("Update forecast").click();
  cy.heading("Update forecast");
};

export const displayCorrectOverheadRate = () => {
  cy.getByQA("overhead-costs").contains("Overhead costs");
  cy.getByQA("overhead-costs").contains("20.00%");
};

export const updateLabourCalculateOH = () => {
  [
    [50.24, 10.048],
    [6530.64, 1306.128],
    [50.64, 10.128],
    [100, 20],
    [1000000, 200000],
    [10000.33, 2000.066],
    [5.11, 1.022],
    [33.33, 6.666],
  ].forEach(([labourCost, overhead]) => {
    cy.getByAriaLabel("Labour Period 2").clear().type(String(labourCost));
    let newCurrency = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    });
    cy.get("tr")
      .eq(4)
      .within(() => {
        cy.get("td:nth-child(14)").contains(newCurrency.format(labourCost));
      });
    cy.getByAriaLabel("Overheads Period 2").should("have.value", overhead);
    cy.get("tr")
      .eq(5)
      .within(() => {
        cy.get("td:nth-child(14)").contains(newCurrency.format(overhead));
      });
  });
};

export const submitForecastBackOut = () => {
  cy.get("button").contains("Submit").click();
  cy.heading("Forecast");
  cy.backLink("Back to forecasts").click();
  cy.heading("Forecasts");
};

export const backToDash = () => {
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
  cy.reload();
};

export const returnToForecastArea = () => {
  cy.selectTile("Forecasts");
  cy.heading("Forecasts");
  cy.tableCell("EUI Small Ent Health").siblings().contains("View forecast").click();
  cy.heading("Forecast");
  cy.get("tr")
    .eq(5)
    .within(() => {
      cy.get("td:nth-child(3)").contains(/^£6.67$/);
    });
};

export const clickUpdateCheckValues = () => {
  cy.get("a").contains("Update forecast").click();
  cy.heading("Update forecast");
  cy.getByAriaLabel("Overheads Period 2").should("have.value", "6.666");
};

export const topThreeRows = () => {
  [
    ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    ["IAR Due", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
    [
      "Month",
      "Feb 2023",
      "Mar 2023",
      "Apr 2023",
      "May 2023",
      "Jun 2023",
      "Jul 2023",
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
      "Feb 2024",
    ],
  ].forEach(([col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13], rowNumber = 0) => {
    cy.get("tr")
      .eq(rowNumber + 1)
      .within(() => {
        cy.get("th:nth-child(1)").contains(col1);
        cy.get("th:nth-child(2)").contains(col2);
        cy.get("th:nth-child(3)").contains(col3);
        cy.get("th:nth-child(4)").contains(col4);
        cy.get("th:nth-child(5)").contains(col5);
        cy.get("th:nth-child(6)").contains(col6);
        cy.get("th:nth-child(7)").contains(col7);
        cy.get("th:nth-child(8)").contains(col8);
        cy.get("th:nth-child(9)").contains(col9);
        cy.get("th:nth-child(10)").contains(col10);
        cy.get("th:nth-child(11)").contains(col11);
        cy.get("th:nth-child(12)").contains(col12);
        cy.get("th:nth-child(13)").contains(col13);
      });
  });
};

export const forecastValues = () => {
  let rowNumber = 3;
  [
    ["£33,333.00", "£111.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
  ].forEach(([col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12]) => {
    rowNumber++;
    cy.get("tr")
      .eq(rowNumber)
      .within(() => {
        cy.get("td:nth-child(2)").contains(col1);
        cy.get("td:nth-child(3)").contains(col2);
        cy.get("td:nth-child(4)").contains(col3);
        cy.get("td:nth-child(5)").contains(col4);
        cy.get("td:nth-child(6)").contains(col5);
        cy.get("td:nth-child(7)").contains(col6);
        cy.get("td:nth-child(8)").contains(col7);
        cy.get("td:nth-child(9)").contains(col8);
        cy.get("td:nth-child(10)").contains(col9);
        cy.get("td:nth-child(11)").contains(col10);
        cy.get("td:nth-child(12)").contains(col11);
        cy.get("td:nth-child(13)").contains(col12);
      });
  });
};
