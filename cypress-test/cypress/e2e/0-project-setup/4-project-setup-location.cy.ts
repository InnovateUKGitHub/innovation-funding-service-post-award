import { visitApp } from "../../common/visit";
import { newLocation, shouldShowProjectTitle } from "./steps";
describe("Project setup > Provide your project location postcode", () => {
  before(() => {
    visitApp({});
    cy.navigateToProject("365447");
  });

  it("Should navigate to 'Provide your project location postcode' section", () => {
    cy.get("a").contains("Provide your project location postcode").click();
    cy.get("h1").contains("Provide your project location postcode");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to set up your project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show 'New location' with guidance information", newLocation);

  it("Should have a 'Save and return to project setup' button", () => {
    cy.submitButton("Save and return to project setup");
  });
});
