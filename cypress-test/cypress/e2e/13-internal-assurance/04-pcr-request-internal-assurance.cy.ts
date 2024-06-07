import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import { accessAddPartnerCheckCopy, createAddPartnerCheckCopy, startNewRequestCopy } from "./steps";
const pm = "james.black@euimeabs.test";
describe("Internal Assurance > PCR Request & add partner copy", () => {
  before(() => {
    visitApp({ asUser: pm });
    cy.navigateToProject("770699");
  });

  after(() => {
    cy.deletePcr("770699");
  });

  it("Should access the project change requests tile", () => {
    cy.selectTile("Project change requests");
    cy.heading("Project change requests");
    pcrTidyUp("Draft");
    cy.heading("Start a new request");
  });

  it("Should have correct copy on the start new request page", startNewRequestCopy);

  it("Should create Add partner request and check correct copy exists on Request page", createAddPartnerCheckCopy);

  it("Should access the Add partner PCR and check for correct copy", accessAddPartnerCheckCopy);
});
