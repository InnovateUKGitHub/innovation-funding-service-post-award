import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  backOutAndDelete,
  deletionWarningMessage,
  selectEachPcr,
  validateTable,
  verifyDeletePageLoads,
  deleteAndConfirm,
} from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("PCR > Delete page", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });

  it("Should select all available PCR types and create a new request", selectEachPcr);

  it("Should wait to allow Salesforce to finish creating the PCR in the back-end", () => {
    cy.wait(5000);
  });

  it("Should back out of the PCR and then click the delete button", backOutAndDelete);

  it("Should verify that the delete page loaded correctly and validate the table", verifyDeletePageLoads);

  it("Should display deletion warning message", deletionWarningMessage);

  it("Should contain full table information including PCR types, number and dates started", validateTable);

  it("Should have the correctly coloured delete button", () => {
    cy.button("Delete request").should("have.css", "background-color").and("eq", "rgb(0, 112, 60)");
  });

  it("Should click delete and confirm it has been deleted", deleteAndConfirm);
});
