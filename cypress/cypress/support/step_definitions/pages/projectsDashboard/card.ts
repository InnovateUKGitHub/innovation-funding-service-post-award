import { Then, When } from "@badeball/cypress-cucumber-preprocessor";

Then("I should see the {int}", function (projectNumber: number) {
  cy.get(".acc-list-item").contains(projectNumber);
});

When("I navigate to my project", function () {
  const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
  cy.log("**navigateToProject**");
  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).contains(this.userInfo?.project?.number).click({ force: true });
});
