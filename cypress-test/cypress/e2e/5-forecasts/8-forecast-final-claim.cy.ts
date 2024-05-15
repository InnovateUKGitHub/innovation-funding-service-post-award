import { visitApp } from "common/visit";
const fcContact = "pauline.o'jones@uobcw.org.uk.test.prod";
describe("Forecast > Final claim", () => {
  before(() => {
    visitApp({ asUser: fcContact, path: "projects/a0E2600000kSvOGEA0/overview" });
  });

  it("Should display project Overview and click into the Forecast tile", () => {
    cy.heading("Project overview");
    cy.selectTile("Forecast");
  });

  it("Should display the Forecast heading and guidance", () => {
    cy.heading("Forecast");
    cy.get("h2").contains("Deep Rock Galactic");
    cy.paragraph(
      "You can now amend your forecasted costs at any time (as long as the related period's claim has not yet been approved).",
    );
    cy.getByQA("validation-message-content").contains("You cannot change your forecast. You must ");
    cy.get("a").contains("submit your final claim");
  });

  it("Should click 'Submit your final claim' and land on the correct claim page", () => {
    cy.clickOn("submit your final claim");
    cy.heading("Costs to be claimed");
    cy.validationNotification("This is the final claim.");
  });
});
