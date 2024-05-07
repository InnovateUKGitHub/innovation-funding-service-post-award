import { visitApp } from "common/visit";
import {
  associateStartDate,
  associateTable,
  associateUpdateAndSave,
  associateValidateAllowedInput,
  associateValidateAlphaSpecialInput,
  associateValidateNumericPastInput,
  associateWorkingBacklink,
  displayAssociateProjectCard,
  validateDayAndMonthFields,
  validationDynamic,
} from "./steps";

const pmEmail = "testman1@testing.com";

describe("Project setup > KTP Associate", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
  });

  it("Should click the Projects tile", () => {
    cy.getByQA("navigation-card-label").contains("Projects").click();
    cy.heading("Dashboard");
  });

  it("Should display the Cypress associate project card with correct information", displayAssociateProjectCard);

  it("Should click into the Cypress associate Project", () => {
    cy.selectProject("539538");
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should display the Associate start date heading", () => {
    cy.heading("Associate start date");
  });

  it("Should have a working back-link and then return to project", associateWorkingBacklink);

  it("Should display appropriate copy", () => {
    cy.get("p").contains(
      "You need to provide an associate start date so we can complete this section of the project setup.",
    );
  });

  it("Should display a table of information on the associate", associateTable);

  it("Should have a Start date section", associateStartDate);

  it("Should validate the date input boxes with past years", associateValidateNumericPastInput);

  it("Should validate the day and month fields", validateDayAndMonthFields);

  it("Should validate alpha and special characters", associateValidateAlphaSpecialInput);

  it("Should dynamically remove validation messaging when a valid date has been entered", validationDynamic);

  it("Should validate the date input fields with allowed dates and save correctly", associateValidateAllowedInput);

  it(
    "should update the start date and pre-populate with correctly entered date upon returning",
    associateUpdateAndSave,
  );
});
