import { forEach } from "cypress/types/lodash";

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

export const showPartnerTableHeadings = () => {
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
    cy.getByAriaLabel(labourField).clear({ force: true }).type("10").wait(500);
  });
};

export const exceedGrantValue = () => {
  cy.get("a").contains("Edit forecast").click();
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
  cy.submitButton("Submit changes").click();
  cy.get("h2").contains("There is a problem");
};

export const revertCategoriesSubmit = () => {
  cy.getByAriaLabel("Labour Period 2").clear().type("11.10").wait(500);
  cy.getByAriaLabel("Labour Period 3").clear().type("22.20").wait(500);
  cy.getByAriaLabel("Labour Period 4").clear().type("33.30").wait(500);
  cy.getByAriaLabel("Labour Period 5").clear().type("44.40").wait(500);
  cy.getByAriaLabel("Labour Period 6").clear().type("55.55").wait(500);
  cy.getByAriaLabel("Labour Period 7").clear().type("50.89").wait(500);
  cy.getByAriaLabel("Labour Period 8").clear().type("777.00").wait(500);
  cy.submitButton("Submit changes").click();
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
  cy.get("tr")
    .eq(4)
    .within(() => {
      cy.get("td:nth-child(14)").contains("£34,781.66");
    });
  cy.get("button").contains("Submit changes").click();
  cy.get("a").contains("Edit forecast");
  cy.get("td:nth-child(4)").contains("111");
  cy.get("tr")
    .eq(4)
    .within(() => {
      cy.get("td:nth-child(14)").contains("£34,781.66");
    });
};

export const clickForecastAccessEUI = () => {
  cy.selectTile("Forecasts");
  cy.get("td").contains("EUI Small Ent Health").siblings().contains("View forecast").click();
};

export const clickEditForecastButton = () => {
  cy.heading("Forecast");
  cy.get("a").contains("Edit forecast").click();
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
  cy.get("button").contains("Submit changes").click();
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

export const clickEditCheckValues = () => {
  cy.get("a").contains("Edit forecast").click();
  cy.heading("Update forecast");
  cy.getByAriaLabel("Overheads Period 2").should("have.value", "6.666");
};

export const topThreeRows = () => {
  [
    ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    ["IAR Due", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes"],
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
    ],
  ].forEach((cols, rowNumber = 0) => {
    cy.get("tr")
      .eq(rowNumber + 1)
      .within(() => {
        for (let i = 0; i < cols.length; i++) {
          cy.get(`th:nth-child(${i + 1})`).contains(cols[i]);
        }
      });
  });
};

export const forecastValues = () => {
  let rowNumber = 3;
  [
    [
      "£33,333.00",
      "£11.10",
      "£22.20",
      "£33.30",
      "£44.40",
      "£55.55",
      "£50.89",
      "£777.00",
      "£133.33",
      "£144.99",
      "£111.12",
      "£222.22",
    ],
    [
      "£35,000.00",
      "-£5,000.00",
      "£111.11",
      "£222.22",
      "£333.33",
      "£444.44",
      "£555.55",
      "£666.66",
      "£777.77",
      "£888.88",
      "£999.99",
      "£0.00",
    ],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
    ["£35,000.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00", "£0.00"],
  ].forEach(cols => {
    rowNumber++;
    cy.get("tr")
      .eq(rowNumber)
      .within(() => {
        for (let i = 0; i < cols.length; i++) {
          cy.get(`td:nth-child(${i + 2})`).contains(cols[i]);
        }
      });
  });
};

export const correctTableHeaders = () => {
  cy.getByQA("total-header").contains("Total");
  cy.getByQA("total-eligible-cost").contains("Total eligible costs");
  cy.tableHeader("Difference");
};

export const correctForecastTotals = () => {
  let tableRow = 3;
  [
    ["£34,939.10", "£35,000.00", "-0.17%"],
    ["£34,999.95", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£0.00", "£0.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£349,939.05", "£350,000.00", "-0.02%"],
  ].forEach(([total, totalEligible, difference]) => {
    tableRow++;
    cy.get("tr")
      .eq(tableRow)
      .within(() => {
        cy.get("td:nth-child(14)").contains(total);
        cy.get("td:nth-child(15)").contains(totalEligible);
        cy.get("td:nth-child(16)").contains(difference);
      });
  });
};

export const forecastPartnerTable = () => {
  let tableRow = 0;
  [
    ["EUI Small Ent Health (Lead)", "£350,000.00", "£349,939.05", "£350,000.00"],
    ["A B Cad Services", "£50,000.00", "£42,400.00", "£50,000.00"],
    ["ABS EUI Medium Enterprise", "£101,000.00", "£17,900.00", "£101,000.00"],
    ["Deep Rock Galactic", "£350,000.00", "£54,667.46", "£350,000.00"],
  ].forEach(([partner, totalEligible, forecasts, underspend]) => {
    tableRow++;
    cy.get("tr")
      .eq(tableRow)
      .within(() => {
        cy.get("td:nth-child(1)").contains(partner);
        cy.get("td:nth-child(2)").contains(totalEligible);
        cy.get("td:nth-child(3)").contains(forecasts);
        cy.get("td:nth-child(4)").contains(underspend);
      });
  });
};
