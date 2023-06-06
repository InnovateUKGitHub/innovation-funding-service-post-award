import { visitApp } from "common/visit";

describe("claims > edit claims as FC", () => {
  before(() => {
    visitApp({ asUser: "s.shuang@irc.trde.org.uk.test" });
    cy.navigateToProject("734203");
    cy.selectTile("Claims");
  });

  it("Should begin editing", () => {
    cy.get("a").contains("Edit").click();
    cy.get("h1").contains("Costs to be claimed");
    cy.get("a").contains("Labour").click();
  });

  it("Should add 120 line items", () => {
    cy.get('input[name="itemCount"]').then($input => {
      const count = Number($input.val() || 0);

      for (let i = count; i < 120; i++) {
        cy.get("a").contains("Add a cost").click();
        cy.get("#description" + i).type("Labour" + i);
        cy.get("#value" + i).type("100");
      }
    });
    cy.wait(500);
  });

  it("Should save and continue", () => {
    cy.submitButton("Save and return to claims").click();
    cy.wait(1000);
    cy.get("h1").contains("Costs to be claimed");
  });

  it("Should go back into Labour and delete the line items", () => {
    cy.get("a").contains("Labour").click();
    cy.get("h1").contains("Labour");
    cy.get('input[name="itemCount"]').then($input => {
      const count = Number($input.val() || 0);
      for (let i = count; i < 120; i++) {
        cy.get("a").contains("Remove").click();
      }
    });
  });

  it("Should save and continue having deleted the line items", () => {
    cy.submitButton("Save and return to claims").click();
  });
});
