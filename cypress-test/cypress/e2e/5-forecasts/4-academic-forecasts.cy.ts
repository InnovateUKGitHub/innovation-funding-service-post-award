import { visitApp } from "common/visit";
import { academicCosts, forecastDownloadLinks, noDownloadLinks, updateAcademicCosts } from "./steps";

const fcContact = "s.shuang@irc.trde.org.uk.test";

describe("Forecast > Academic", { tags: "smoke" }, () => {
  before(() => {
    // cy.intercept("POST", "/projects/*/pcrs/*/prepare").as("pcrPrepare");
    visitApp({ asUser: fcContact, path: "/projects/a0E2600000kSotUEAS/overview" });
  });

  it("Should click the Forecast tile and continue to the Forecast page", () => {
    cy.selectTile("Forecast");
    cy.heading("Forecast");
    cy.get("h2").contains("ABS EUI Medium Enterprise");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should display the forecast table with correct academic cost categories", academicCosts);

  it("Should have working download links for the forecast table", forecastDownloadLinks);

  it("Should click 'Edit forecast button'", () => {
    cy.get("a").contains("Edit forecast").click();
  });

  it("Should update the forecast table and calculate the entries correctly", updateAcademicCosts);

  it("Should not have any download links available", noDownloadLinks);

  it("Should remove a number from the box, attempt to submit and generate an error", () => {
    cy.getByAriaLabel("Directly incurred - Staff Period 3").clear();
    cy.wait(500);
    cy.submitButton("Submit changes").click();
    cy.validationLink("Enter forecast.");
    cy.get("a").contains("Enter forecast.");
  });

  it("Should click 'Back to project'", () => {
    cy.backLink("Back to forecast").click();
    cy.heading("Forecast");
  });
});
