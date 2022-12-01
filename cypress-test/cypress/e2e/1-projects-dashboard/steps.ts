const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const testProjectName = "CYPRESS";

export const logInAsUserAndNavigateToProject = (email: string) => {
  cy.switchUserTo(email, true);

  cy.contains("Projects").click({ force: true });
  cy.get(`${projectCardCss} a`).wait(1000).contains(testProjectName).click();
};

export const monitoringReportCardShouldNotExist = () => {
  cy.get(".card-link h2").contains("Monitoring reports").should("not.exist");
};

export const shouldNavigateToProjectDashboard = () => {
  cy.contains("Projects").click();
  cy.get("h1").contains("Dashboard");
};

export const shouldFindMatchingProjectCard = projectCard => {
  cy.get(".card-link h2").contains(projectCard);
};

export const shouldDisplayTwoProjectCards = () => () => {
  cy.get(".card-link").should("have.length", 2);
};

export const shouldShowAListOfProjectCards = () => {
  cy.get(projectCardCss).should("have.length.greaterThan", 5);
};

export const shouldFilterProjectsUsingCheckboxes = ([label, expectedText]) => {
  cy.getByLabel(label).click();

  cy.get(projectCardCss).each(card => cy.wrap(card).contains(expectedText));

  // unselect checkbox again
  cy.getByLabel(label).click();
};

export const shouldFilterProjectsUsingSearchFilter = () => {
  cy.get("input#search").type(testProjectName);

  cy.get(projectCardCss).should("have.length", 1);
};

export const shouldNavigateToProjectOverview = () => {
  cy.get(`${projectCardCss} a`).wait(500).contains(testProjectName).click();

  cy.get("h1").contains("Project overview");
  cy.getByQA("page-title").should("contain.text", testProjectName);
};

export const shouldHaveShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click()
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", 'CYPRESS')
};

export const shouldShowCostCatTable = () => {
  cy.get("thead.govuk-table__head")
  cy.get("tr.govuk-table__row")
  cy.get("th.govuk-table__header").contains("Category")
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Total eligible costs")
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Eligible costs claimed to date")
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Costs claimed this period")
  cy.get("th.govuk-table__header.govuk-table__header--numeric").contains("Remaining eligible costs")
};