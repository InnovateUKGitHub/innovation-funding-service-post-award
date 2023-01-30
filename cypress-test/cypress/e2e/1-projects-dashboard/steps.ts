const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const cardId = "328407";

export const navigateToProject = () => {
  cy.contains("Projects").click();
  cy.getByQA(`project-${cardId}`).contains(cardId).click();
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
  cy.getByLabel(label).check();

  cy.getByQA("pending-and-open-projects")
    .getByQA("section-content")
    .then($projects => {
      // @ts-ignore
      if ($projects.text().includes("There are no matching live projects.")) {
        cy.log(`after checking "${label}" there are no matching live projects`);
      } else {
        cy.get(projectCardCss).each(card => cy.wrap(card).contains(expectedText));
      }
    });

  // unselect checkbox again
  cy.getByLabel(label).uncheck();
};

export const shouldFilterProjectsUsingSearchFilter = () => {
  cy.get("input#search").type("CYPRESS");
  cy.get(projectCardCss).each(card => cy.wrap(card).contains("CYPRESS"));
  cy.get("input#search").clear();
};

/**
 * cy.wait is required in shouldNavigateToProjectOverview
 */
export const shouldNavigateToProjectOverview = () => {
  cy.get(`${projectCardCss} a`).contains(cardId).wait(500).click({ force: true });

  cy.get("h1", { timeout: 10000 }).contains("Project overview");
  cy.getByQA("page-title").should("contain.text", cardId);
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};
