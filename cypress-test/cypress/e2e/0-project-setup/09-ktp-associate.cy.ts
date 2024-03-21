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
        cy.get("div").contains("You need to provide confirmation of the associate's start date");
      });
    });
  });

  it("Should click into the Cypress associate Project", () => {
    cy.getByQA("pending-and-open-projects").contains("539538").click();
  });

  it("Should have the project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should display the Associate start date heading", () => {
    cy.heading("Associate start date");
  });

  it("Should have a working backlink and then return to project", () => {
    cy.clickOn("Back to projects");
    cy.heading("Dashboard");
    cy.getByQA("pending-and-open-projects").contains("539538").click();
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
      cy.getByLabel(input).clear().type("lorem");
      cy.clickOn("Save and return to dashboard");
      cy.validationLink("Enter a valid start date.");
      cy.paragraph("Enter a valid start date.");
      cy.getByLabel(input).clear();
    });
  });
});
