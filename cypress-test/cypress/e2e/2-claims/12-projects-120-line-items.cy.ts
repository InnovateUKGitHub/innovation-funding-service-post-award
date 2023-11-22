import { visitApp } from "common/visit";
import { add120Lines, beginEditing, removeLineItems, saveLineItems } from "./steps";

describe("claims > Add 120 line items", () => {
  before(() => {
    visitApp({ asUser: "contact77@test.co.uk" });
    cy.navigateToProject("154870");
    cy.selectTile("Claims");
  });

  it("Should begin editing", beginEditing);

  it("Should add 120 line items", add120Lines);

  it("Should save line items and continue", saveLineItems);

  it("Should go back into Labour and delete the line items", removeLineItems);

  it("Should save and continue having deleted the line items", () => {
    cy.clickOn("Save and return to claims");
    cy.heading("Costs to be claimed");
  });
});
