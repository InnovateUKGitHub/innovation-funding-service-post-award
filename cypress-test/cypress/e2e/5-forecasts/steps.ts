import { euiCostCleanUp } from "common/costCleanUp";
import { visitApp } from "common/visit";

export const ohForecastCleanup = () => {
  cy.get("tr")
    .eq(4)
    .then($labour => {
      if ($labour.text().includes("£1,000.00")) {
        cy.log("**Cleaning up labour costs**");
        cy.clickOn("Back to forecast");
        cy.backLink("Back to forecasts").click();
        cy.backLink("Back to project").click();
        cy.heading("Project overview");
        cy.selectTile("Claims");
        cy.get("a").contains("Edit").click();
        cy.heading("Costs to be claimed");
        euiCostCleanUp();
        cy.clickOn("Back to claims");
        cy.heading("Claims");
        cy.clickOn("Back to project");
        cy.heading("Project overview");
        clickForecastAccessEUI();
        cy.clickOn("Edit forecast");
      }
    });
};

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
    cy.getByAriaLabel(labourField).clear({ force: true }).type("10").wait(200);
  });
};

export const exceedGrantValue = () => {
  cy.get("a").contains("Edit forecast").click();
  cy.get(`input[aria-label="Labour Period 3"]`).clear({ force: true }).type("34446").wait(200);
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

  cy.validationLink("Enter forecast.");
  cy.get(`[data-qa="validation-summary"]`).within(() => {
    cy.get("a").then($validationMsg => {
      let msgNumber = $validationMsg.length;
      if (msgNumber !== 6) {
        cy.log(msgNumber.toString());
        throw new Error();
      } else if (msgNumber == 6) {
        cy.log("Test passed because number of validation messages should be 6.");
        cy.log(`Number of validation messages: ${msgNumber.toString()}`);
      }
    });
  });
};

export const revertCategoriesSubmit = () => {
  cy.getByAriaLabel("Labour Period 2").clear().type("11.10").wait(200);
  cy.getByAriaLabel("Labour Period 3").clear().type("22.20").wait(200);
  cy.getByAriaLabel("Labour Period 4").clear().type("33.30").wait(200);
  cy.getByAriaLabel("Labour Period 5").clear().type("44.40").wait(200);
  cy.getByAriaLabel("Labour Period 6").clear().type("55.55").wait(200);
  cy.getByAriaLabel("Labour Period 7").clear().type("50.89").wait(200);
  cy.getByAriaLabel("Labour Period 8").clear().type("777.00").wait(200);
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
  const costCats = [
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
  ];

  costCats.forEach(forecastInput => {
    cy.getByAriaLabel(forecastInput).clear().type("100");
  });
  cy.get("td:nth-child(14)").contains("£52,600.00");
  costCats.forEach(forecastInput => {
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
  cy.intercept("/api/forecast-details/*").as("submitWait");
  cy.get("button").contains("Submit changes").click();
  cy.wait("@submitWait");
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
  cy.heading("Forecasts");
  cy.get("td").contains("EUI Small Ent Health").siblings().contains("View forecast").click();
};

export const clickEditForecastButton = () => {
  cy.heading("Forecast");
  cy.get("a").contains("Edit forecast").click();
  cy.heading("Update forecast");
};

export const displayCorrectOverheadRate = () => {
  cy.paragraph("Overheads costs: 20.00%");
};

export const updateLabourCalculateOH = () => {
  [
    [-25000, -5000],
    [-2000, -400],
    [-3333.33, -666.666],
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
    cy.getByAriaLabel("Overheads Period 2").should("have.text", newCurrency.format(overhead));
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
  cy.getByAriaLabel("Overheads Period 2").should("have.text", "£6.67");
};

export const topThreeRows = () => {
  [
    ["Period", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    ["IAR Due", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes", "No", "No", "Yes"],
    [
      "Month",
      "Feb 2024",
      "Mar 2024",
      "Apr 2024",
      "May 2024",
      "Jun 2024",
      "Jul 2024",
      "Aug 2024",
      "Sep 2024",
      "Oct 2024",
      "Nov 2024",
      "Dec 2024",
      "Jan 2025",
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
  ].forEach((cols, index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        for (let i = 0; i < cols.length; i++) {
          cy.get(`td:nth-child(${i + 2})`).contains(cols[i]);
        }
      });
  });
};

export const correctTableHeaders = () => {
  ["Costs you are claiming", "Forecast", "Total", "Total eligible costs", "Difference"].forEach((header, index) => {
    cy.get(`th:nth-child(${index + 2})`).contains(header);
  });
};

export const correctForecastTotals = () => {
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
  ].forEach(([total, totalEligible, difference], index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        cy.get("td:nth-child(14)").contains(total);
        cy.get("td:nth-child(15)").contains(totalEligible);
        cy.get("td:nth-child(16)").contains(difference);
      });
  });
};

export const forecastPartnerTable = () => {
  [
    ["EUI Small Ent Health (Lead)", "£350,000.00", "£349,939.05", "£60.95"],
    ["A B Cad Services", "£82,000.00", "£59,400.00", "£22,600.00"],
    ["ABS EUI Medium Enterprise", "£101,000.00", "£17,900.00", "£83,100.00"],
    ["Deep Rock Galactic", "£350,000.00", "£54,667.46", "£295,332.54"],
  ].forEach(([partner, totalEligible, forecasts, underspend], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(partner);
        cy.get("td:nth-child(2)").contains(totalEligible);
        cy.get("td:nth-child(3)").contains(forecasts);
        cy.get("td:nth-child(4)").contains(underspend);
      });
  });
};

export const accessAbCadForecast = () => {
  cy.get("tr")
    .eq(2)
    .within(() => {
      cy.get("td:nth-child(6)").contains("View forecast").click();
    });
};

export const displayAbCadForecast = () => {
  cy.get("h2").contains("A B Cad Services");
  ["Labour", "£42,400.00", "£7,200.50", "£3,000.00", "£3,000.00"].forEach((field, index) => {
    cy.get("tr")
      .eq(4)
      .within(() => {
        cy.get(`td:nth-child(${index + 1})`).contains(field);
      });
  });
  [
    ["£55,600.50", "£50,000.00", "11.20%"],
    ["£0.00", "£0.00", "0.00%"],
    ["£12,200.50", "£20,000.00", "-39.00%"],
    ["£0.00", "£0.00", "0.00%"],
    ["£12,000.00", "£12,000.00", "0.00%"],
  ].forEach(([total, totalEligible, difference], index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        cy.get(`td:nth-child(14)`).contains(total);
        cy.get(`td:nth-child(15)`).contains(totalEligible);
        cy.get(`td:nth-child(16)`).contains(difference);
      });
  });
};

export const saveNegativeValues = () => {
  cy.getByAriaLabel("Labour Period 2").clear().type("-3333.33");
  cy.getByAriaLabel("Overheads Period 2").should("have.text", "-£666.67");
  cy.clickOn("Submit changes");
  cy.get("tr")
    .eq(4)
    .within(() => {
      cy.get("td:nth-child(3)").contains("-£3,333.33");
    });
  cy.get("tr")
    .eq(5)
    .within(() => {
      cy.get("td:nth-child(3)").contains("-£666.67");
    });
};

export const enterExtremePositiveValue = () => {
  cy.getByAriaLabel("Labour Period 3").clear().type("9999999999999");
  cy.getByQA("validation-summary").should("not.contain", "A validation error occurred.");
  cy.validationLink("Your overall total cannot be higher than your total eligible costs.");
  cy.validationLink("Forecast must be £999,999,999,999.00 or less.");
};

export const enterExtremeNegativeValue = () => {
  cy.getByAriaLabel("Labour Period 3").clear().type("-9999999999999");
  cy.getByQA("validation-summary").should("not.contain", "A validation error occurred.");
  cy.validationLink("Forecast must be -£1,000,000,000.00 or more.");
};

export const accessEuiSmallEntHealthForecast = () => {
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.get("a").contains("View forecast").click();
    });
  cy.get("h2").contains("EUI Small Ent Health");
};

export const displayEUIForecast = () => {
  [
    ["Labour", "£0.00", "-£3,333.33"],
    ["Overheads", "£0.00", "-£666.67"],
    ["Materials", "£35,000.00", "£0.00"],
    ["Capital usage", "£35,000.00", "£0.00"],
    ["Subcontracting", "£0.00", "£0.00"],
    ["Travel and subsistence", "£35,000.00", "£0.00"],
    ["Other costs", "£35,000.00", "£0.00"],
    ["Other costs 2", "£35,000.00", "£0.00"],
    ["Other costs 3", "£35,000.00", "£0.00"],
    ["Other costs 4", "£35,000.00", "£0.00"],
    ["Other costs 5", "£35,000.00", "£0.00"],
  ].forEach(([costCat, costsClaiming, period1], index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costCat);
        cy.get("td:nth-child(2)").contains(costsClaiming);
        cy.get("td:nth-child(3)").contains(period1);
      });
  });
  [
    ["-£3,333.33", "£35,000.00", "-109.52%"],
    ["-£666.67", "£35,000.00", "-101.90%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£0.00", "£0.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
    ["£35,000.00", "£35,000.00", "0.00%"],
  ].forEach(([total, totalEligible, difference], index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        cy.get("td:nth-child(14)").contains(total);
        cy.get("td:nth-child(15)").contains(totalEligible);
        cy.get("td:nth-child(16)").contains(difference);
      });
  });
};

export const viewAbCadForecast = () => {
  [
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£17,500.00", "-100.00%"],
    ["£0.00", "£0.00", "0.00%"],
  ].forEach(([total, totalEligible, difference], index) => {
    cy.get("tr")
      .eq(index + 4)
      .within(() => {
        cy.get("td:nth-child(14)").contains(total);
        cy.get("td:nth-child(15)").contains(totalEligible);
        cy.get("td:nth-child(16)").contains(difference);
      });
  });
};

export const noEditForecastLink = () => {
  cy.get("a").should("not.contain", "Edit forecast");
  cy.get("a").should("not.contain", "Update forecast");
};

export const hybridForecastPartnerTable = () => {
  [
    ["EUI Small Ent Health (Lead)", "£350,000.00", "£276,000.00", "£74,000.00"],
    ["A B Cad Services", "£175,000.00", "£0.00", "£175,000.00"],
    ["ABS EUI Medium Enterprise", "£50,000.00", "£49,000.00", "£1,000.00"],
  ].forEach(([partner, totalEl, forecastAndCosts, underspend], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(partner);
        cy.get("td:nth-child(2)").contains(totalEl);
        cy.get("td:nth-child(3)").contains(forecastAndCosts);
        cy.get("td:nth-child(4)").contains(underspend);
      });
  });
};

export const hybridUpdateCostsReflect = () => {
  ["-1000.05", "-1000.07"].forEach((cost, index) => {
    cy.getByAriaLabel(`Materials Period ${index + 2}`)
      .clear()
      .type(cost);
  });
  cy.clickOn("Submit changes");
  cy.button("Edit forecast");
  cy.backLink("Back to forecasts").click();
  cy.heading("Forecasts");
  [["EUI Small Ent Health (Lead)", "£350,000.00", "£273,999.88", "£76,000.12"]].forEach(
    ([partner, totalEl, forecastAndCosts, underspend]) => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get("td:nth-child(1)").contains(partner);
          cy.get("td:nth-child(2)").contains(totalEl);
          cy.get("td:nth-child(3)").contains(forecastAndCosts);
          cy.get("td:nth-child(4)").contains(underspend);
        });
    },
  );
};

export const accessEUIRemoveUnderspend = () => {
  accessEuiSmallEntHealthForecast();
  cy.clickOn("Edit forecast");
  cy.getByAriaLabel(`Materials Period 2`).clear().type("0");
  cy.getByAriaLabel(`Materials Period 3`).clear().type("0");
  cy.button("Submit changes").click();
  cy.button("Edit forecast");
  cy.backLink("Back to forecasts").click();
  cy.heading("Forecasts");
  hybridForecastPartnerTable();
};
