const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const cardId = "328407";

export const pmEmail = "james.black@euimeabs.test";
const fcOne = "wed.addams@test.test.co.uk";
const fcTwo = "s.shuang@irc.trde.org.uk.test";
const moEmail = "contact77@test.co.uk";
const fcFour = "iukprovarmo5@gmail.com.bjssdev";
const fcFive = "q.lewis@auto-monitoring.co.uk";
const fcSix = "s.john@auto-research.co.uk";
const fcSeven = "m.davies@auto-health.co.uk";
const fcEight = "t.williamson@auto-research.co.uk";
const fcNine = "b.doe@auto-corp.co.uk";
const fcTen = "n.mcdermott@auto-health.co.uk";
const fcEleven = "u.adams-taylor@auto-research.co.uk";

export const monitoringReportCardShouldNotExist = () => {
  cy.get(".card-link h2").contains("Monitoring reports").should("not.exist");
};

export const shouldNavigateToProjectDashboard = () => {
  cy.get("h2").contains("Projects").click();
  cy.get("h1").contains("Dashboard");
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

  cy.get("h1").contains("Project overview");
  cy.getByQA("page-title").should("contain.text", cardId);
};

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const navigateFilter = () => {
  cy.getByQA("projects-dashboard-label").click();
  cy.get("#search").type("328407");
};

export const switchUserTestLiveArea = () => {
  [fcOne, fcTwo, moEmail, fcFour, fcFive, fcSix, fcSeven, fcEight, fcNine, fcTen, fcEleven].forEach(contact => {
    cy.clearAllCookies();
    cy.wait(1000);
    cy.switchUserTo(contact);
    cy.getByQA("pending-and-open-projects").contains("154870");
    cy.wait(1000);
  });
};
