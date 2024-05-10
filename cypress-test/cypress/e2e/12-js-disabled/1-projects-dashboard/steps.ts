import { otherCost5TidyUp } from "common/costCleanUp";
import { fileTidyUp } from "common/filetidyup";
import { uploadIAR } from "e2e/2-claims/steps";

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

const javierBaez = "testman2@testing.com";

let date = new Date().toUTCString();
let comments = date;

export const monitoringReportCardShouldNotExist = () => {
  cy.get(".card-link h2").contains("Monitoring reports").should("not.exist");
};

export const shouldNavigateToProjectDashboard = () => {
  cy.get("h2").contains("Projects").click();
  cy.heading("Dashboard");
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
  cy.clickOn("Search projects");

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
  cy.getByLabel("Search").type("CYPRESS");
  cy.clickOn("Search projects");
  cy.get(projectCardCss).each(card => cy.wrap(card).contains("CYPRESS"));
  cy.getByLabel("Search").clear();
  cy.clickOn("Search projects");
};

/**
 * cy.wait is required in shouldNavigateToProjectOverview
 */
export const shouldNavigateToProjectOverview = () => {
  cy.get(`${projectCardCss} a`).contains(cardId).wait(500).click({ force: true });

  cy.heading("Project overview");
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
    cy.switchUserTo(contact, { jsDisabled: true });
    cy.getByQA("pending-and-open-projects").contains("154870");
    cy.wait(1000);
  });
};

export const hasBroadcasts = () => {
  cy.get("h2").contains("Broadcasts");
  ["Cypress broadcast message", "KTP KTP KTP KTP KTP KTP KTP KTP KTP KTP", "CR&D CR&D CR&D CR&D CR&D CR&D"].forEach(
    broadcast => {
      cy.paragraph(broadcast);
    },
  );
  cy.get("span").should("not.contain", "I shouldn't appear");
};

export const ktpBroadcastInvisible = () => {
  cy.get("span").should("not.have.text", "This is a KTP-only broadcast message.");
  cy.get("span").should("not.contain", "I shouldn't appear");
};

export const hasLimitedBroadcasts = () => {
  cy.get("h2").contains("Broadcasts");
  ["Cypress broadcast message", "CR&D CR&D CR&D CR&D CR&D CR&D"].forEach(broadcast => {
    cy.paragraph(broadcast);
  });
};

export const accessBroadCastMessageAndAssert = (message: string) => {
  cy.get("p").contains(message).siblings().contains("Read more").click();

  cy.heading(message);
  ["Details", "Message"].forEach(subheader => {
    cy.get("h2").contains(subheader);
  });
  ["Start date:", "End date:", "1 January 1900", "1 January 2100"].forEach(item => {
    cy.paragraph(item);
  });
};

export const broadcastMessageText = (message: string) => {
  cy.paragraph(message);
};

export const backToDashboard = () => {
  cy.backLink("Back to Project").click();
  cy.heading("Dashboard");
};

export const projectDashboardFinancials = () => {
  cy.getByQA("project-summary-gol-costs").contains("Total eligible costs");
  cy.getByQA("project-summary-gol-costs").contains("£575,000.00");
  cy.getByQA("project-summary-claimed-costs").contains("Eligible costs claimed to date");
  cy.getByQA("project-summary-claimed-costs").contains("£49,000.00");
  cy.getByQA("project-summary-claimed-percentage").contains("Percentage of eligible costs claimed to date");
  cy.getByQA("project-summary-claimed-percentage").contains("8.52%");
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

export const jamesBlackCounters = () => {
  [
    ["365447", "You need to set up your project"],
    ["328407", "Claim overdue"],
    ["328407", "Project change request queried"],
  ].forEach(([project, counter]) => {
    cy.getByQA(`project-${project}`).contains(counter);
  });
};

export const javierBaezCounters = () => {
  [
    ["154870", "Claims to review: 3"],
    ["154870", "Claim overdue"],
    ["879546", "Claim overdue"],
    ["597638", "Project change requests to review: 2"],
    ["191431", "Claim overdue"],
    ["271316", "Claim overdue"],
    ["223377", "Claim overdue"],
    ["663878", "Claim overdue"],
  ].forEach(([project, counter]) => {
    cy.getByQA(`project-${project}`).contains(counter);
  });
};

export const access879546NavToClaims = () => {
  cy.selectProject("879546");
  cy.heading("Project overview");
  cy.selectTile("Claims");
  cy.heading("Claims");
};

export const checkClaimQueriedByMo = () => {
  cy.contains("td", "Period 1:")
    .siblings()
    .then($tr => {
      if ($tr.text().includes("Submitted to Monitoring Officer")) {
        cy.get("a").contains("Back to project").click();
        cy.heading("Project overview");
        cy.switchUserTo(javierBaez);
        cy.selectTile("Claims");
        cy.heading("Claims");
        cy.get("td").contains("ABS EUI Medium").siblings().contains("a", "Review").click();
        cy.heading("Claim");
        cy.clickOn("Query claim");
        cy.get("textarea").as("txt").wait(200);
        cy.get("@txt").clear();
        cy.get("@txt").type(comments);
        cy.paragraph("You have");
        cy.paragraph("I am satisfied that the costs claimed appear to comply");
        cy.clickOn("Send query");
        cy.heading("Claims");
        cy.clickOn("Back to project");
        cy.heading("Project overview");
      } else if ($tr.text().includes("Queried by Monitoring Officer")) {
        cy.get("a").contains("Back to project").click();
        cy.heading("Project overview");
      }
    });
};

export const navigateToDashCheckStatus = () => {
  cy.clickOn("Back to Project");
  cy.heading("Dashboard");
  cy.getByQA("project-879546").contains("Claim queried");
};

export const switchToJavierCheckStatus = () => {
  cy.wait(500);
  cy.switchUserTo(javierBaez, { jsDisabled: true });
  cy.wait(500);
  cy.getByQA("project-879546").contains("Claims to review: 1");
};

export const accessProjectSubmitToMO = () => {
  cy.selectProject("879546");
  cy.heading("Project overview");
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.get("a").contains("Edit").click();
  cy.heading("Costs to be claimed");
  otherCost5TidyUp();
  cy.clickOn("Continue to claims documents");
  cy.heading("Claim documents");
  fileTidyUp("Sarah Shuang");
  uploadIAR();
  cy.clickOn("Continue to update forecast");
  cy.heading("Update forecast");
  cy.clickOn("Continue to summary");
  cy.heading("Claim summary");
  cy.clickOn("Submit claim");
  cy.heading("Claims");
};

export const backOutToDashCheckStatus = () => {
  cy.clickOn("Back to Project");
  cy.heading("Dashboard");
  cy.wait(500);
  cy.getByQA("project-879546").should("not.contain", "Claim queried");
};

export const accessProjectCheckClaimsTile = () => {
  cy.selectProject("879546");
  cy.heading("Project overview");
  cy.getByQA("overview-link-allClaimsDashboard").contains("Claims to review: 2");
};

export const accessClaimQuery = () => {
  cy.selectTile("Claims");
  cy.heading("Claims");
  cy.get("td").contains("ABS EUI Medium").siblings().contains("a", "Review").click();
  cy.heading("Claim");
  cy.clickOn("Query claim");
  cy.get("textarea").as("txt").wait(200);
  cy.get("@txt").clear();
  cy.get("@txt").type(comments);
  cy.paragraph("I am satisfied that the costs claimed appear to comply");
  cy.clickOn("Submit");
  cy.heading("Claims");
};

export const backOutToDashCheckUpdatedCounter = () => {
  cy.clickOn("Back to project");
  cy.heading("Project overview");
  cy.getByQA("overview-link-allClaimsDashboard").contains("Claims to review: 1");
};
