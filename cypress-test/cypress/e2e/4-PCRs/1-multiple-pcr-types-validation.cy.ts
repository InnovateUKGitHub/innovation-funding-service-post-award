import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  addTypesForValidation,
  backOutCreateNewPcr,
  confirmPcrsAdded,
  selectEachPcr,
  assertForMissingPcrTypes,
  submitWithoutCompleting,
  assertForMissingTypesNewPcr,
  assertForMissingTypesReaccessed,
} from "./steps";

describe("PCR > Multiple add types", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });
  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select all available PCR types and create a new request", selectEachPcr);

  it("Should check the PCR types successfully added", confirmPcrsAdded);

  it(
    "Should try to submit the PCR without having completed each section and prompt correct validation messaging",
    submitWithoutCompleting,
  );

  it("Should attempt to add 3 more types and prompt validation", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
    addTypesForValidation("Add to request");
  });

  it("Should allow you to add a remove partner ", () => {
    cy.getByLabel("Change a partner's name").uncheck();
    cy.button("Add to request").click();
    cy.heading("Request");
  });

  it(
    "Should access 'Add types' one more time and assert that some PCRs can no longer be added",
    assertForMissingPcrTypes,
  );

  it("Should back out and begin creating another PCR", backOutCreateNewPcr);

  it("Should validate that some PCRs cannot be added", assertForMissingTypesNewPcr);

  it("Should cancel and re-access the PCR previously created", () => {
    cy.get("a").contains("Cancel").click();
    cy.heading("Project change requests");
    cy.get("a").contains("Edit").click();
    cy.heading("Request");
  });

  it("Should navigate to the Add types screen again", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
  });

  it("Should show that only one type can now be added to the PCR", assertForMissingTypesReaccessed);
});
