import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  addPcrTypes,
  backOutCreateNewPcr,
  confirmPcrsAdded,
  selectEachPcr,
  assertForMissingPcrTypes,
  submitWithoutCompleting,
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

  it("Should add 3 more types", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
    addPcrTypes("Add to request");
  });

  it("Should again add 3 more types", () => {
    cy.get("a").contains("Add types").click();
    cy.heading("Add types");
    addPcrTypes("Add to request");
  });

  it(
    "Should access 'Add types' one more time and assert that some PCRs can no longer be added",
    assertForMissingPcrTypes,
  );

  it("Should back out and begin creating another PCR", backOutCreateNewPcr);

  it("Should assert that certain PCR types cannot be created more than once", assertForMissingPcrTypes);
});
