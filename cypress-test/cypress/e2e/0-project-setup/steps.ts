const partners = ["EUI Small Ent Health", "ABS EUI Medium Enterprise", "A B Cad Services"] as const;

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const displayForecastTable = () => {
  [
    "Period",
    "IAR Due",
    "Month",
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
    "Total",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "No",
    "Forecast",
    "Total",
    "Total eligible costs",
    "Difference",
    "£0.00",
    "0.00%",
  ].forEach(tableItem => {
    cy.getByQA("forecast-table").contains(tableItem);
  });
};

export const fillOrgInformation = () => {
  cy.get("legend").contains("Organisation information");
  cy.get("p").contains("EUI Small Ent Health");
  cy.getByLabel("Company number");
  cy.get("#hint-for-companyNumber").contains("This is the registered organisation number.");
  cy.get("#companyNumber").type("12345678910");
};

export const fillAccountInformation = () => {
  cy.get("legend").contains("Account details");
  cy.getByLabel("Sort code");
  cy.get("#hint-for-sortCode").contains("Must be 6 digits long, for example: 311212.");
  cy.get("#sortCode").type("654321");
  cy.getByLabel("Account number");
  cy.get("#hint-for-accountNumber").contains("Must be between 6 and 8 digits long, for example: 15481965.");
  cy.get("#accountNumber").type("12345678");
};

export const fillAddressInformation = () => {
  cy.get("legend").contains("Billing address");
  cy.get("p").contains(
    "This is the billing address connected to this bank account. This is not the address of the bank.",
  );
  cy.getByLabel("Building").type("Polaris House");
  cy.getByLabel("Street").type("North Star Avenue");
  cy.getByLabel("Locality").type("Off Great Western Way");
  cy.getByLabel("Town or city").type("Swindon");
  cy.getByLabel("Postcode").type("SN2 1FL");
};

export const newLocation = () => {
  cy.getByLabel("New location");
  cy.get("#hint-for-new-postcode").contains("Enter the postcode.");
  cy.get("#new-postcode").type("SN123456788");
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("Your location entry must be no more than 10 characters.");
  cy.get("#new-postcode").clear().type("SN2 1FL");
  cy.submitButton("Save and return to project setup").click();
};

export const giveUsInformation = () => {
  [
    "Set spend profile",
    "Provide your bank details",
    "Provide your project location postcode",
    "To do",
    "Incomplete",
    "Complete",
  ].forEach(toDo => {
    cy.getByQA("taskList").contains(toDo);
  });
  cy.get("h2").contains("Give us information");
};

export const partnerValidation = () => {
  cy.getByQA("partner-information").contains(partners[0]).click();
  cy.get("a").contains("Edit").click();
  cy.get("#new-postcode").clear().type("SN123456789");
  cy.submitButton("Save and return to partner information").click();
  cy.validationMessage("Your location entry must be no more than 10 characters.");
  cy.get("#new-postcode").clear().type("SN2");
  cy.submitButton("Save and return to partner information").click();
  cy.backLink("Back to project details").click();
};

export const bankDetailsValidation = () => {
  cy.submitButton("Submit bank details").click();
  cy.validationMessage("Sort code cannot be empty.");
  cy.validationMessage("Account number cannot be empty.");
  cy.get("p").contains("Sort code cannot be empty.");
  cy.get("p").contains("Account number cannot be empty");
  cy.reload();
};

export const spendProfileValidation = () => {
  cy.getByAriaLabel("Labour Period 1").clear();
  cy.wait(500);
  cy.submitButton("Save and return to project setup").click();
  cy.validationMessage("Forecast is required");
  cy.getByAriaLabel("Labour Period 1").type("0");
};
