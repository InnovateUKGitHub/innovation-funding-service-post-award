import { visitApp } from "../../common/visit";
const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const testProjectName = "__CYPRUS_TEST__";

describe("projects dashboard", () => {
  before(() => {
    visitApp();
  });

  it("displays two cards", () => {
    cy.get(".card-link").should("have.length", 2);
  });

  it('should navigate to project dashboard when the "Projects" card is selected', () => {
    cy.contains("Projects").click();
    cy.get("h1").contains("Dashboard");
  });

  it("should show a list of project cards", () => {
    cy.get(projectCardCss).should("have.length.greaterThan", 5);
  });

  [
    ["PCR's being queried", "Project change request queried"],
    ["Claims to review", "Claims to review"],
    ["PCR's to review", "Project change requests to review"],
    ["Not completed setup", "You need to set up your project"],
    ["Claims to submit", "You need to submit your claim."],
    ["Claims needing responses", "Claim queried"],
  ].forEach(([label, expectedText]) => {
    it(`should have a ${label} filter`, () => {
      cy.getByLabel(label).click();

      cy.get(projectCardCss).each(card => cy.wrap(card).contains(expectedText));

      // unselect checkbox again
      cy.getByLabel(label).click();
    });
  });

  it("should have a filter search button that will filter the projects", () => {
    cy.get("input#search").type(testProjectName);

    cy.get(projectCardCss).should("have.length", 1);
  });

  it("should navigate to the correct project details page when the project card is clicked", () => {
    cy.get(`${projectCardCss} a`).wait(500).contains(testProjectName).click();

    cy.get("h1").contains("Project overview");
    cy.get('[data-qa="page-title"').should("contain.text", testProjectName);
  });

  const expectedProjectCards = [
    "Claims",
    "Monitoring reports",
    "Forecast",
    "Project change requests",
    "Documents",
    "Project details",
    "Finance summary",
  ];
  expectedProjectCards.forEach(projectCard => {
    it(`should show the "${projectCard}" Link`, () => {
      cy.get(".card-link h2").contains(projectCard);
    });
  });
});
