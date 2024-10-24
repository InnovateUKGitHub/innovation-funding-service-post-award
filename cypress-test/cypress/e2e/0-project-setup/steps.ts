import { loremIpsum100Char } from "common/lorem";
import { revertSpendTableZero } from "common/spend-table-edit";

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const correctSpendProfileTotals = () => {
  [
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£7,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£35,000.00", "0.00%"],
    ["£0.00", "£357,000.00", "0.00%"],
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

export const fillOrgInformation = () => {
  cy.get("legend").contains("Organisation information");
  cy.paragraph("EUI Small Ent Health");
  cy.getByLabel("Company number");
  cy.get("#hint-for-companyNumber").contains("This is the registered organisation number.");
  cy.getByLabel("Company number").clear().type("12345678910");
};

export const fillAccountInfoInvalid = () => {
  cy.get("legend").contains("Account details");
  cy.getByLabel("Sort code");
  cy.get("#hint-for-sortCode").contains("Must be 6 digits long, for example: 311212.");
  cy.getByLabel("Sort code").clear().type("654321654321");
  cy.getByLabel("Account number");
  cy.get("#hint-for-accountNumber").contains("Must be between 6 and 8 digits long, for example: 15481965.");
  cy.getByLabel("Account number").clear().type("1234567887654321");
  cy.button("Submit bank details").click();
};

export const correctSyntaxInvalidDetails = () => {
  cy.getByLabel("Sort code").clear().type("123321");
  cy.getByLabel("Account number").clear().type("12332123");
  cy.button("Submit bank details").click();
};

export const correctSyntaxValidation = () => {
  cy.validationLink("Check your sort code and account number.");
};

export const validateInvalidAccDetails = () => {
  cy.get("h2").contains("There is a problem");
  cy.validationLink("Enter a valid sort code.");
  cy.validationLink("Enter a valid account number.");
  cy.get("p").contains("Enter a valid sort code.");
  cy.get("p").contains("Enter a valid account number.");
};

export const fillAccountInformation = () => {
  cy.get("legend").contains("Account details");
  cy.getByLabel("Sort code");
  cy.get("#hint-for-sortCode").contains("Must be 6 digits long, for example: 311212.");
  cy.getByLabel("Sort code").clear().type("654321");
  cy.getByLabel("Account number");
  cy.get("#hint-for-accountNumber").contains("Must be between 6 and 8 digits long, for example: 15481965.");
  cy.getByLabel("Account number").clear().type("12345678");
};

export const fillAddressInformation = () => {
  cy.get("legend").contains("Billing address");
  cy.paragraph("This is the billing address connected to this bank account. This is not the address of the bank.");
  cy.getByLabel("Building").type("Polaris House");
  cy.getByLabel("Street").type("North Star Avenue");
  cy.getByLabel("Locality").type("Off Great Western Way");
  cy.getByLabel("Town or city").type("Swindon");
  cy.getByLabel("Postcode").type("SN2 1FL");
};

export const newLocation = () => {
  cy.getByLabel("New location");
  cy.get("#hint-for-postcode").contains("Enter the postcode.");
};

export const clearAndSubmit = () => {
  cy.getByLabel("New location").clear();
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("You must provide your project location postcode.");
};

export const enterInvalidPostcode = () => {
  cy.getByLabel("New location").type("SN123456789");
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("Project location postcode must be 10 characters or less.");
  cy.paragraph("Project location postcode must be 10 characters or less.");
};

export const enterNullPostcode = () => {
  cy.getByLabel("New location").clear();
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("Enter project location postcode.");
  cy.paragraph("Enter project location postcode.");
};

export const enterValidPostcode = () => {
  cy.getByLabel("New location").clear().type("SN2 1FL");
  cy.submitButton("Save and return to project setup").click();
  cy.heading("Project setup");
};

export const giveUsInformation = () => {
  let listNumber = 4;
  [
    ["Set spend profile", "Incomplete"],
    ["Provide your bank details", "To do"],
    ["Provide your project location postcode", "Complete"],
  ].forEach(([section, status]) => {
    cy.get("li").eq(listNumber).contains(section);
    cy.get("li").eq(listNumber).contains(status);
    listNumber++;
  });
  cy.get("h2").contains("Give us information");
};

export const bankDetailsValidation = () => {
  cy.getByLabel("Sort code").clear();
  cy.getByLabel("Account number").clear();
  cy.submitButton("Submit bank details").click();
  cy.validationMessage("Sort code cannot be empty.");
  cy.validationMessage("Account number cannot be empty.");
  cy.paragraph("Sort code cannot be empty.");
  cy.paragraph("Account number cannot be empty");
  cy.reload();
};

export const spendProfileNullValidation = () => {
  cy.getByAriaLabel("Labour Period 1").clear();
  cy.wait(500);
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("Enter forecast.");
  cy.getByAriaLabel("Labour Period 1").type("0");
};

export const saveAndValidate = () => {
  cy.get("legend").contains("Mark as complete");
  cy.clickCheckBox("This is ready to submit");
  cy.submitButton("Save and return to project setup").click();
  [
    "The total forecasts for labour must be the same as the total eligible costs",
    //"The total forecasts for overheads must be the same as the total eligible costs",
    "The total forecasts for materials must be the same as the total eligible costs",
    "The total forecasts for capital usage must be the same as the total eligible costs",
    "The total forecasts for subcontracting must be the same as the total eligible costs",
    "The total forecasts for travel and subsistence must be the same as the total eligible costs",
    "The total forecasts for other costs must be the same as the total eligible costs",
    "The total forecasts for other costs 2 must be the same as the total eligible costs",
    "The total forecasts for other costs 3 must be the same as the total eligible costs",
    "The total forecasts for other costs 4 must be the same as the total eligible costs",
    "The total forecasts for other costs 5 must be the same as the total eligible costs",
  ].forEach(validationMessage => {
    cy.validationLink(validationMessage);
  });
};

export const saveAndRemoveValidationMsg = () => {
  [
    "The total forecasts for labour must be the same as the total eligible costs",
    //"The total forecasts for overheads must be the same as the total eligible costs",
    "The total forecasts for materials must be the same as the total eligible costs",
    "The total forecasts for capital usage must be the same as the total eligible costs",
    "The total forecasts for subcontracting must be the same as the total eligible costs",
    "The total forecasts for travel and subsistence must be the same as the total eligible costs",
    "The total forecasts for other costs must be the same as the total eligible costs",
    "The total forecasts for other costs 2 must be the same as the total eligible costs",
    "The total forecasts for other costs 3 must be the same as the total eligible costs",
    "The total forecasts for other costs 4 must be the same as the total eligible costs",
    "The total forecasts for other costs 5 must be the same as the total eligible costs",
  ].forEach(validationMessage => {
    cy.get("body").should("not.contain", validationMessage);
  });
};

export const spendTableTidyUp = (valueSearch: string) => {
  cy.get("main").within(() => {
    cy.get("table").then($table => {
      if ($table.text().includes(valueSearch)) {
        cy.wait(500);
        revertSpendTableZero();
      }
    });
  });
};

export const submitComplete = () => {
  cy.button("Save and return to project setup").click();
  cy.heading("Project setup");
  cy.get("li").eq(4).contains("Complete");
};

export const reaccessSpendProfile = () => {
  cy.get("a").contains("Set spend profile").click();
  cy.heading("Spend Profile");
  cy.get("#submit").should("be.checked");
};

export const checkSpendProfileIncomplete = () => {
  cy.backLink("Back to set up your project").click();
  cy.heading("Project setup");
  cy.get("li").eq(4).contains("Incomplete");
};

export const spendLabourCalculateOH = () => {
  [
    [-10000, -2000],
    [-888, -177.6],
    [-66666, -13333.2],
    [-3333, -666.6],
    [0, 0],
    [22728.44, 4545.688],
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
    cy.getByAriaLabel("Overheads Period 2").contains(newCurrency.format(overhead));
    cy.get("tr")
      .eq(5)
      .within(() => {
        cy.get("td:nth-child(14)").contains(newCurrency.format(overhead));
      });
  });
};

export const manualTopThreeRows = () => {
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
  ].forEach((cols, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        for (let i = 0; i < cols.length; i++) {
          cy.get(`th:nth-child(${i + 1})`).contains(cols[i]);
        }
      });
  });
};

export const ifsTopThreeRows = () => {
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

const associateValidationMessage = "The start date must be the same as or after 1 January 2000.";

export const displayAssociateProjectCard = () => {
  cy.getByQA("pending-and-open-projects").within(() => {
    cy.getByQA("project-539538").within(() => {
      cy.get("h3").contains("CYPRESS_KTP_ASSOCIATE_DO_NOT_TOUCH");
      cy.get("div").contains("You can update the associate's start date here");
    });
  });
};

export const associateWorkingBacklink = () => {
  cy.clickOn("Back to projects");
  cy.heading("Dashboard");
  cy.selectProject("539538");
  cy.heading("Associate start date");
};

export const associateTable = () => {
  [
    ["Name", "Wednesday Addams"],
    ["Role", "Associate"],
    ["Email address", "wed.addams@test.test.co.uk"],
  ].forEach(([key, listItem]) => {
    cy.getListItemFromKey(key, listItem);
  });
};

export const associateStartDate = () => {
  ["Start date", "Day", "Month", "Year"].forEach(label => {
    cy.getByLabel(label);
  });
};

export const associateValidateNumericPastInput = () => {
  cy.enter("Day", "01");
  cy.enter("Month", "01");
  ["0000", "0002", "0100", "1900", "1945", "1985"].forEach(year => {
    cy.enter("Year", year);
    cy.clickOn("Save and return to dashboard");
    cy.validationLink(associateValidationMessage);
    cy.paragraph(associateValidationMessage);
    cy.getByLabel("Year").clear();
  });
};

export const validateDayAndMonthFields = () => {
  ["32", "32", "32", "31", "32", "31", "32", "32", "31", "32", "31", "32"].forEach((day, index) => {
    let month = index + 1;
    cy.enter("Day", day);
    cy.enter("Month", month.toString());
    cy.enter("Year", "2024");
    cy.clickOn("Save and return to dashboard");
    cy.validationLink("Enter a valid start date.");
    cy.paragraph("Enter a valid start date.");
    cy.getByLabel("Day").clear();
    cy.getByLabel("Month").clear();
  });
};

export const associateValidateAllowedInput = () => {
  cy.enter("Day", "01");
  cy.enter("Month", "01");
  ["2000", "2010", "2020", "2024", "2025", "2030"].forEach(year => {
    cy.enter("Year", year);
    cy.clickOn("Save and return to dashboard");
    cy.heading("Dashboard");
    cy.selectProject("539538");
    cy.heading("Associate start date");
    cy.getByLabel("Year").clear();
  });
};

export const associateValidateAlphaSpecialInput = () => {
  cy.enter("Day", "01");
  cy.enter("Month", "01");
  ["Lorem", "!£$%^&*(", loremIpsum100Char].forEach(year => {
    cy.enter("Year", year);
    cy.clickOn("Save and return to dashboard");
    cy.validationLink("Enter a valid start date.");
    cy.paragraph("Enter a valid start date.");
    cy.getByLabel("Year").clear();
  });
};

export const associateUpdateAndSave = () => {
  cy.enter("Day", "12");
  cy.enter("Month", "6");
  cy.enter("Year", "2024");
  cy.clickOn("Save and return to dashboard");
  cy.selectProject("539538");
  cy.checkEntry("Day", "12");
  cy.checkEntry("Month", "06");
  cy.checkEntry("Year", "2024");
  cy.enter("Day", "15");
  cy.enter("Month", "1");
  cy.enter("Year", "2025");
  cy.clickOn("Save and return to dashboard");
  cy.selectProject("539538");
  cy.checkEntry("Day", "15");
  cy.checkEntry("Month", "01");
  cy.checkEntry("Year", "2025");
};

export const validationDynamic = () => {
  cy.getByLabel("Day").clear();
  cy.enter("Month", "01");
  cy.enter("Year", "2024");
  cy.clickOn("Save and return to dashboard");
  cy.validationLink("Enter a valid start date.");
  cy.enter("Day", "01");
  cy.getByQA("validation-summary").should("not.exist");
};
