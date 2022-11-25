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

  it("should have a selection of checkbox filters that filter ", () => {
    cy.getByLabel("PCR's being queried").click();

    cy.get(projectCardCss).each(card => cy.wrap(card).contains("Project change request queried"))

    // unselect checkbox again
    cy.getByLabel("PCR's being queried").click();
  })

  it("should have a filter search button that will filter the projects", () => {
    cy.get("input#search").type(testProjectName);

    cy.get(projectCardCss).should("have.length", 1);
  });

  it("should navigate to the correct project details page when the project card is clicked", () => {
    cy.get(`${projectCardCss} a`).wait(500).contains(testProjectName).click();

    cy.get("h1").contains("Project overview");
    cy.get('[data-qa="page-title"').should("contain.text", testProjectName)
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
        cy.get(".card-link h2").contains(projectCard)
      });
    });
  });

});
