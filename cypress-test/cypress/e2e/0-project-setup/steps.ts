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
  cy.validationMessage("Your location entry must be no more than 10 characters.");
};

export const enterNullPostcode = () => {
  cy.getByLabel("New location").clear();
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("You must provide your project location postcode.");
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
  cy.validationMessage("Forecast is required");
  cy.getByAriaLabel("Labour Period 1").type("0");
};

export const saveAndValidate = () => {
  cy.get("h2").contains("Mark as complete");
  cy.clickCheckBox("This is ready to submit");
  cy.submitButton("Save and return to project setup").click;
  [
    "The total forecasts for labour must be the same as the total eligible costs",
    "The total forecasts for overheads must be the same as the total eligible costs",
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
    "The total forecasts for overheads must be the same as the total eligible costs",
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

export const spendTableTidyUp = () => {
  cy.get("table").then($table => {
    if ($table.text().includes("£1,200.00")) {
      cy.wait(500);
      revertSpendTableZero();
    }
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
};

export const checkSpendProfileIncomplete = () => {
  cy.backLink("Back to set up your project").click();
  cy.heading("Project setup");
  cy.get("li").eq(4).contains("Incomplete");
};
