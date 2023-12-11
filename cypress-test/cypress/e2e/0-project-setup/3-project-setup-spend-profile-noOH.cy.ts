import { visitApp } from "common/visit";
import { shouldShowProjectTitle } from "./steps";

const fcEmail = "contact77@test.co.uk";

describe("Project setup > Set spend profile without an overhead rate", () => {
  before(() => {
    visitApp({ asUser: fcEmail });
    cy.navigateToProject("365447");
  });

  it("Should navigate to the spend profile section", () => {
    cy.get("a").contains("Set spend profile").click();
    cy.heading("Spend Profile");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to set up your project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have guidance information", () => {
    cy.paragraph(
      "You must provide a forecast of all eligible project costs to reflect your spend throughout the project.",
    );
  });

  it("Should have an overhead row independent to labour which will accept independent input", () => {
    for (let i = 1; i < 12; i++)
      [[`Labour Period ${i}`], [`Overheads Period ${i}`]].forEach(([labour, overhead]) => {
        cy.getByAriaLabel(labour).clear().type("100");
        cy.getByAriaLabel(overhead).should("have.value", 0);
      });
  });
});
