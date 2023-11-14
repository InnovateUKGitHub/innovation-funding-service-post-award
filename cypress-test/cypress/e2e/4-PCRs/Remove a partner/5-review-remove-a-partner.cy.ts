import { visitApp } from "common/visit";
import { shouldShowProjectTitle } from "../steps";

const mo = "testman2@testing.com";
describe("PCR > Remove a partner > Review", () => {
  before(() => {
    visitApp({ asUser: mo });
    cy.navigateToProject("328407");
  });

  it("Should navigate to the PCR tile and access the PCR in Review", () => {
    cy.selectTile("Project change requests");
    cy.heading("Project change requests");
    cy.get("a").contains("Review").click();
    cy.heading("Request");
  });

  it("Should display 'Remove a partner' with 'Complete' against it", () => {
    cy.getByQA("WhatDoYouWantToDo").contains("Complete");
  });

  it("Should access the 'Remove partner section'", () => {
    cy.get("a").contains("Remove a partner").click();
    cy.heading("Remove a partner");
  });

  it("Should have correct project title", shouldShowProjectTitle);

  it("Should validate the contents of the PCR", () => {
    [
      ["Partner being removed", "ABS EUI Medium Enterprise"],
      ["Last period", "11"],
      ["Documents", "t02.docx"],
    ].forEach(([item, content]) => {
      cy.getListItemFromKey(item, content);
    });
  });

  it("Should read the contents of the file correctly", () => {
    cy.downloadFile(
      "/api/documents/projectChangeRequests/a0E2600000kSotUEAS/a0G260000076DU2EAM/06826000001iguCAAQ/content",
    );
  });

  it("Should have a correctly functioning 'Next' arrow", () => {
    cy.getByQA("arrow-left").contains("Reasoning");
    cy.getByQA("arrow-left").contains("Next").click();
    cy.heading("Reasons for Innovate UK");
  });

  it("Should use the 'previous' arrow to navigate back to Remove a partner", () => {
    cy.getByQA("arrow-right").contains("Remove a partner");
    cy.getByQA("arrow-right").contains("Previous").click();
    cy.heading("Remove a partner");
  });

  it("Should have a working backlink", () => {
    cy.backLink("Back to request").click();
    cy.heading("Request");
  });
});
