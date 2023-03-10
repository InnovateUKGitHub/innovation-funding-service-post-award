import { visitApp } from "common/visit";
import { academicCosts, updateAcademicCosts } from "./steps";

const fcContact = "s.shuang@irc.trde.org.uk.test";

describe("Forecast > Academic", () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp({ asUser: fcContact, path: "/projects/a0E2600000kSotUEAS/overview" });
  });

  it("Should click the Forecast tile and continue to the Forecast page", () => {
    cy.selectTile("Forecast");
    cy.get("h1").contains("Forecast");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should display the forecast table with correct academic cost categories", academicCosts);

  it("Should click 'Update forecast button'", () => {
    cy.get("a").contains("Update forecast").click();
  });

  it("Should update the forecast table and calculate the entries correctly", updateAcademicCosts);

  it("Should remove a number from the box, attempt to submit and generate an error", () => {
    cy.getByAriaLabel("Directly incurred - Staff Period 2").clear();
    cy.wait(500);
    cy.submitButton("Submit").click();
    cy.getByQA("validation-summary").contains("There is a problem");
    cy.get("a").contains("Forecast is required.");
  });

  it("Should click 'Back to project'", () => {
    cy.backLink("Back to forecast").click();
    cy.get("h1").contains("Forecast");
  });
});
