import { visitApp } from "../../common/visit";
import { shouldShowProjectTitle } from "./steps";

describe("Project setup > general", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("365447");
  });

  it("Should have a 'Project setup' paging heading with guidance text", () => {
    cy.get("h1").contains("Project setup");
    cy.get("p").contains("You need to give us some information so that we can complete project setup.");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to projects");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have a 'Give us information' subheading and list of requirements", () => {
    ["Set spend profile", "Provide your bank details", "Provide your project location postcode", "To do"].forEach(
      toDo => {
        cy.getByQA("taskList").contains(toDo);
      },
    );
    cy.get("h2").contains("Give us information");
  });

  it("Should have a 'Complete project setup' button", () => {
    cy.submitButton("Complete project setup");
  });
});
