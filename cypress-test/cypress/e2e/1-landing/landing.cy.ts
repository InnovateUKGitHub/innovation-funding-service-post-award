import { visitApp } from "../../common/visit";
const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const testProjectName = "__CYPRUS_TEST__";

describe("landing page > projects dashboard > selected project", () => {
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

  it("should have project change requests to review filter", () =>
    testCheckbox("PCR's being queried", "Project change request queried"));

  it("should have a claims to review filter", () => testCheckbox("Claims to review", "Claims to review"));

  it("should have a pcr's to review filter", () =>
    testCheckbox("PCR's to review", "Project change requests to review"));

  it("should have a not completed setup filter", () =>
    testCheckbox("Not completed setup", "You need to set up your project"));

  it("should have a claims to submit filter", () => testCheckbox("Claims to submit", "You need to submit your claim."));
  
  it("should have a claims needing responses filter", () => testCheckbox("Claims needing responses", "Claim queried"));

  it("should have a filter search button that will filter the projects", () => {
    cy.get("input#search").type(testProjectName);

    cy.get(projectCardCss).should("have.length", 1);
  });

  it("should navigate to the correct project details page when the project card is clicked", () => {
    cy.get(`${projectCardCss} a`).wait(500).contains(testProjectName).click();

    cy.get("h1").contains("Project overview");
    cy.get('[data-qa="page-title"').should("contain.text", testProjectName);
  });

  describe("project card links for this project", () => {
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
});

function testCheckbox(label: string, expectedText: string) {
  cy.getByLabel(label).click();

  cy.get(projectCardCss).each(card => cy.wrap(card).contains(expectedText));

  // unselect checkbox again
  cy.getByLabel(label).click();
}
