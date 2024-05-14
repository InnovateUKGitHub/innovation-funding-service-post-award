import { visitApp } from "common/visit";
import { workingNextArrow, workingPreviousArrow } from "../steps";

const monitoringOfficer = "testman2@testing.com";

describe("js disabled > PCR >  Change partner name > Review PCR", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: monitoringOfficer, jsDisabled: true });
    cy.navigateToProject("597638");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should access the PCR tile", () => {
    cy.selectTile("Project change requests");
    cy.heading("Project change requests");
  });

  it("Should access the second 1st row in the table", () => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("a").contains("Review").click();
      });
    cy.heading("Request");
  });

  it("Should click into the 'Change a partner's name' section", () => {
    cy.get("a").contains("Change a partner's name").click();
    cy.heading("Change a partner's name");
  });

  it("Should have a working backlink", () => {
    cy.backLink("Back to request").click();
    cy.heading("Request");
    cy.get("a").contains("Change a partner's name").click();
    cy.heading("Change a partner's name");
  });

  it("Should have the correct project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should have a summary of changes", () => {
    [
      ["Existing name", "EUI Small Ent Health"],
      ["Proposed name", "Bob's burgers"],
      ["Change of name certificate", "testfile.doc"],
    ].forEach(([key, item]) => {
      cy.getListItemFromKey(key, item);
    });
  });

  it("Should download the testfile.doc file", () => {
    cy.downloadFile(
      "/api/documents/projectChangeRequests/a0E2600000omEFHEA2/a0G26000007wjLHEAY/06826000002bsMVAAY/content",
    );
  });

  it("Should have a 'Next' arrow which takes the user to the reasoning section", workingNextArrow);

  it("Should have a working previous arrow", () => workingPreviousArrow("Change a partner's name"));
});
