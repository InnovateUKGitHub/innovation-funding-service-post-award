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
  cy.get("h2").contains("Organisation information");
  cy.get("p").contains("EUI Small Ent Health");
  cy.getByLabel("Company number");
  cy.get("#companyNumber-hint").contains("This is the registered organisation number.");
  cy.get("#companyNumber").type("12345678910");
};

export const fillAccountInformation = () => {
  cy.get("h2").contains("Account details");
  cy.getByLabel("Sort code");
  cy.get("#sortCode-hint").contains("Must be 6 digits long, for example: 311212.");
  cy.get("#sortCode").type("654321");
  cy.getByLabel("Account number");
  cy.get("#accountNumber-hint").contains("Must be between 6 and 8 digits long, for example: 15481965.");
  cy.get("#accountNumber").type("12345678");
};

export const fillAddressInformation = () => {
  cy.get("h2").contains("Billing address");
  cy.getByQA("billingAddressFieldsetGuidance").contains(
    "This is the billing address connected to this bank account. This is not the address of the bank.",
  );
  cy.getByLabel("Building");
  cy.get("#accountBuilding").type("Polaris House");
  cy.getByLabel("Street");
  cy.get("#accountStreet").type("North Star Avenue");
  cy.getByLabel("Locality");
  cy.get("#accountLocality").type("Off Great Western Way");
  cy.getByLabel("Town or city");
  cy.get("#accountTownOrCity").type("Swindon");
  cy.getByLabel("Postcode");
  cy.get("#accountPostcode").type("SN2 1FL");
};

export const newLocation = () => {
  cy.getByLabel("New location");
  cy.get("#new-partner-postcode-value-hint").contains("Enter the postcode, postal code or zip code.");
  cy.get("#new-partner-postcode-value").type("SN2 1FL");
};
