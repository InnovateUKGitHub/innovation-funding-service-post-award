import { visitApp } from "../../common/visit";
import { giveUsInformation, shouldShowProjectTitle } from "./steps";

const pmEmail = "this'is'a'test@innovateuk.gov.uk.bjssdev";

describe("Project setup > Manual > general", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
    cy.navigateToProject("472465");
  });

  it("Should have a 'Project setup' page heading with guidance text", () => {
    cy.heading("Project setup");
    cy.paragraph(
      "You need to give us some information so that we can complete project setup. Innovate UK will send you an email when you are able to view your project and begin making claims.",
    );
  });

  it("Should have a back option", () => {
    cy.backLink("Back to projects");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have a 'Give us information' subheading and list of requirements", giveUsInformation);

  it("Should have a 'Return to projects dashboard' button", () => {
    cy.clickOn("Return to projects dashboard");
    cy.heading("Dashboard");
  });
});
