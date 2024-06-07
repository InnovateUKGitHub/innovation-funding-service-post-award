import { visitApp } from "common/visit";
import { documentsCorrectCopy } from "./steps";
const pm = "james.black@euimeabs.test";
const fc = "contact77@test.co.uk";

describe("Internal Assurance > documents copy", () => {
  before(() => {
    visitApp({ asUser: pm });
    cy.navigateToProject("770699");
  });

  it("Should access the documents tile and assert correct copy", documentsCorrectCopy);

  it("Should return to Project overview and switch user to Finance Contact then access documents tile again and assert", () => {
    cy.clickOn("Back to project");
    cy.heading("Project overview");
    cy.switchUserTo(fc);
    cy.heading("Project overview");
    documentsCorrectCopy();
  });
});
