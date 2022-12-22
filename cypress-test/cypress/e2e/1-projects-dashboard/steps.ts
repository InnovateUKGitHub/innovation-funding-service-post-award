const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';

export const logInAsUserAndNavigateToProject = (email: string) => {
  cy.switchUserTo(email, true);

  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains("CYPRESS_DO_NOT_USE").click();
};

export const monitoringReportCardShouldNotExist = () => {
  cy.get(".card-link h2").contains("Monitoring reports").should("not.exist");
};

export const shouldNavigateToProjectDashboard = () => {
  cy.get("h2").contains("Projects").click();
  cy.get("h1", { timeout: 10000 }).contains("Dashboard");
};

export const shouldFindMatchingProjectCard = (projectCard: string) => {
  cy.get(".card-link h2").contains(projectCard);
};

export const shouldDisplayTwoProjectCards = () => () => {
  cy.get(".card-link").should("have.length", 2);
};

export const shouldShowAListOfProjectCards = () => {
  cy.get(projectCardCss).should("have.length.greaterThan", 5);
};

export const shouldFilterProjectsUsingCheckboxes = ([label, expectedText]: [string, string]) => {
  cy.getByLabel(label).click();

  cy.get(projectCardCss).each(card => cy.wrap(card).contains(expectedText));

  // unselect checkbox again
  cy.getByLabel(label).click();
};

export const shouldFilterProjectsUsingSearchFilter = () => {
  cy.get("input#search").type("CYPRESS");
  cy.get(projectCardCss).each(card => cy.wrap(card).contains("CYPRESS"));
  cy.get("input#search").clear();
};

export const shouldNavigateToProjectOverview = () => {
  cy.get(`${projectCardCss} a`).wait(500).contains("CYPRESS_DO_NOT_USE").click();

  cy.get("h1").contains("Project overview");
  cy.getByQA("page-title").should("contain.text", "CYPRESS_DO_NOT_USE");
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};
