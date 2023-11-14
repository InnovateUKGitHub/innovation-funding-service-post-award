import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { createTestFile } from "common/createTestFile";
import { changeNamePcrType, changeNameHeadings, changeNameValidateManyPartners } from "../steps";
const projectManager = "james.black@euimeabs.test";

describe("PCR >  Change a partner's name > Many partners", () => {
  before(() => {
    visitApp({ asUser: projectManager, path: "projects/a0E2600000kTirsEAC/pcrs/dashboard" });
    pcrTidyUp("Change a partner's name");
    createTestFile("bigger_test", 33);
  });

  it("Should create a Change partner name PCR", () => {
    cy.createPcr("Change a partner's name");
  });

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

  it("Should show the correct PCR type and continue to begin the PCR", changeNamePcrType);

  it("Should click Change a partner's name and continue", () => {
    cy.get("a").contains("Change a partner's name").click();
  });

  it("Should contain the PCR title, correct project title and back button", changeNameHeadings);

  it("Should validate that every partner appears on the page", changeNameValidateManyPartners);
});
