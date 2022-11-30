import { visitApp } from "../../common/visit";
import { testEach } from "../../support/methods";
import { shouldNavigateToProjectDashboard } from "./steps";

const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const testProjectName = "__CYPRUS_TEST__";

describe("projects dashboard", () => {
  before(() => {
    visitApp();
  });

  it("displays two cards", () => {
    cy.get(".card-link").should("have.length", 2);
  });

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("should show a list of project cards", () => {
    cy.get(projectCardCss).should("have.length.greaterThan", 5);
  });

  testEach([
    ["PCR's being queried", "Project change request queried"],
    ["Claims to review", "Claims to review"],
    ["PCR's to review", "Project change requests to review"],
    ["Not completed setup", "You need to set up your project"],
    ["Claims to submit", "You need to submit your claim."],
    ["Claims needing responses", "Claim queried"],
  ])(`should have a $0 filter`, ([label, expectedText]) => {
    cy.getByLabel(label).click();

    cy.get(projectCardCss).each(card => cy.wrap(card).contains(expectedText));

    // unselect checkbox again
    cy.getByLabel(label).click();
  });


it("should have a filter search button that will filter the projects", () => {
  cy.get("input#search").type(testProjectName);

  cy.get(projectCardCss).should("have.length", 1);
});

it("should navigate to the correct project details page when the project card is clicked", () => {
  cy.get(`${projectCardCss} a`).wait(500).contains(testProjectName).click();

  cy.get("h1").contains("Project overview");
  cy.getByQA("page-title").should("contain.text", testProjectName);
});

testEach([
  "Claims",
  "Monitoring reports",
  "Forecast",
  "Project change requests",
  "Documents",
  "Project details",
  "Finance summary",
])('should show the "$0" Link', projectCard => {
  cy.get(".card-link h2").contains(projectCard);
});
});
