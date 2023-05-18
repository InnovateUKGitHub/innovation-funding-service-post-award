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
  cy.get("#search").type("328407").wait(200);
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

export const hasBroadcast = () => {
  cy.get("h2").contains("Broadcasts");
  cy.get("span").contains("Cypress broadcast message");
};

export const accessBroadCastMessageAndAssert = () => {
  cy.get("a").contains("Read more").click();
  cy.getByQA("page-title-caption").contains("Broadcast");
  cy.get("h1").contains("Cypress broadcast message");
  ["Details", "Message"].forEach(subheader => {
    cy.get("h2").contains(subheader);
  });
  ["Start date:", "End date:", "30 March 2023", "31 March 2027", "This is a test message for Cypress."].forEach(
    item => {
      cy.get("p").contains(item);
    },
  );
};

export const backToDashboard = () => {
  cy.backLink("Back to Project").click();
  cy.get("h1").contains("Dashboard");
};

export const projectDashboardFinancials = () => {
  cy.getByQA("project-summary-gol-costs").contains("Total eligible costs");
  cy.getByQA("project-summary-gol-costs").contains("£525,000.00");
  cy.getByQA("project-summary-claimed-costs").contains("Eligible costs claimed to date");
  cy.getByQA("project-summary-claimed-costs").contains("£0.00");
  cy.getByQA("project-summary-claimed-percentage").contains("Percentage of eligible costs claimed to date");
  cy.getByQA("project-summary-claimed-percentage").contains("0.00%");
  cy.getByQA("lead-partner-summary-gol-costs").contains("Total eligible costs");
  cy.getByQA("lead-partner-summary-gol-costs").contains("£350,000.00");
  cy.getByQA("lead-partner-summary-claimed-costs").contains("Eligible costs claimed to date");
  cy.getByQA("lead-partner-summary-claimed-costs").contains("£0.00");
  cy.getByQA("lead-partner-summary-claimed-percentage").contains("Percentage of eligible costs claimed to date");
  cy.getByQA("lead-partner-summary-claimed-percentage").contains("0.00%");
  cy.get("h2").contains("Project costs to date");
  cy.get("h2").contains("EUI Small Ent Health costs to date");
};

export const collaboratorFinancials = () => {
  [
    "A B Cad Services costs to date",
    "Total eligible costs",
    "£175,000.00",
    "Eligible costs claimed to date",
    "£0.00",
    "Percentage of eligible costs claimed to date",
    "0.00%",
  ].forEach(summary => {
    cy.getByQA("section-content").contains(summary);
  });
};
