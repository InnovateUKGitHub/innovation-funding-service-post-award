import { visitApp } from "common/visit";

const pmEmail = "testman1@testing.com";

describe("Project setup > KTP Associate", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
  });

  it("Should click the Projects tile", () => {
    cy.getByQA("navigation-card-label").contains("Projects").click();
    cy.heading("Dashboard");
  });

  it("Should display the Cypress associate project card with correct information", () => {
    cy.getByQA("pending-and-open-projects").within(() => {
      cy.getByQA("project-539538").within(() => {
        cy.get("h3").contains("CYPRESS_KTP_ASSOCIATE_DO_NOT_TOUCH");
        cy.get("div").contains("You can update the associate's start date here");
      });
    });
  });

  it("Should click into the Cypress associate Project", () => {
    cy.selectProject("539538");
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should display the Associate start date heading", () => {
    cy.heading("Associate start date");
  });

  it("Should have a working back-link and then return to project", () => {
    cy.clickOn("Back to projects");
    cy.heading("Dashboard");
    cy.selectProject("539538");
    cy.heading("Associate start date");
  });

  it("Should display appropriate copy", () => {
    cy.get("p").contains(
      "You need to provide an associate start date so we can complete this section of the project setup.",
    );
  });

  it("Should display a table of information on the associate", () => {
    [
      ["Name", "Wednesday Addams"],
      ["Role", "Associate"],
      ["Email address", "wed.addams@test.test.co.uk"],
    ].forEach(([key, listItem]) => {
      cy.getListItemFromKey(key, listItem);
    });
  });

  it("Should have a Start date section", () => {
    ["Start date", "Day", "Month", "Year"].forEach(label => {
      cy.getByLabel(label);
    });
  });

  it("Should validate the date input boxes", () => {
    ["Day", "Month", "Year"].forEach(input => {
      cy.enter(input, "lorem");
      cy.clickOn("Save and return to dashboard");
      cy.validationLink("Enter a valid start date.");
      cy.paragraph("Enter a valid start date.");
      cy.getByLabel(input).clear();
    });
  });

  it("should update the start date and pre-populate when returning", () => {
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
  });
});
