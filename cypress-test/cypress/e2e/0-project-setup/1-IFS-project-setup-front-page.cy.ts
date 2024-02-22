import { visitApp } from "../../common/visit";
import { giveUsInformation, shouldShowProjectTitle } from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("Project setup > IFS > general", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
    cy.navigateToProject("365447");
  });

  it("Should have a 'Project setup' page heading with guidance text", () => {
    cy.heading("Project setup");
    cy.paragraph(
      "You need to give us some information so that we can complete project setup. You will then be able to view your project and begin making claims.",
    );
  });

  it("Should have a back option", () => {
    cy.backLink("Back to projects");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have a 'Give us information' subheading and list of requirements", giveUsInformation);

  it("Should have a 'Complete project setup' button", () => {
    cy.submitButton("Complete project setup");
  });
});