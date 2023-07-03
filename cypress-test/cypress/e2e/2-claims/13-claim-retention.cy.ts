import { visitApp } from "common/visit";
const fcEmail = "contact77@test.co.uk";
describe("claims > Trigger Cap Pot Message", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kSvOGEA0/overview" });
  });

  it("Should navigate to claims and open the Period 2 claim for AB Cad Services", () => {
    cy.selectTile("Claims");
    cy.get("td").contains("Period 2").siblings().contains("a", "Edit").click();
    cy.heading("Costs to be claimed");
  });

  it("Should enter costs value in the Labour category which will trigger the Cap Pot messaging", () => {
    cy.get("a").contains("Labour").click();
    cy.heading("Labour");
    cy.get("a").contains("Add a cost").click();
    cy.getByAriaLabel("description of claim line item 1").clear().type("Test line item");
    cy.getByAriaLabel("value of claim line item 1").clear().type("200").wait(800);
  });

  it("Should save and return to the first claims screen", () => {
    cy.submitButton("Save and return to claims").click();
    cy.heading("Costs to be claimed");
  });

  it("Should show validation messaging around the project cap", () => {
    cy.validationMessage(
      "Please be aware, approval of this claim will cause a percentage of your grant to be retained.",
    );
  });
});
