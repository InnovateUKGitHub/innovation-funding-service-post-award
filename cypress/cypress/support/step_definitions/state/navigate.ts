import { Given } from "@badeball/cypress-cucumber-preprocessor";

const navigateToPage = (page: string) => {
  cy.intercept("/internationalisation/**").as("i18n");

  cy.visit(Cypress.config().baseUrl + page, {
    auth: {
      username: Cypress.env("USERNAME"),
      password: Cypress.env("PASSWORD"),
    },
  });

  cy.wait(["@i18n"]);
};

Given("they are on the developer homepage", () => {
  navigateToPage("/");
});

Given("they are on the projects dashboard", () => {
  navigateToPage("/projects/dashboard");
});

Given("they are on the project overview", () => {
  navigateToPage("/projects/dashboard");
});
