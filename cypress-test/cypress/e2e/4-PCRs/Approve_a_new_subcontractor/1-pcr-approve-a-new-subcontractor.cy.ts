import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";

const pm = "james.black@euimeabs.test";

describe("PCR > Create 'Approve a new subcontractor'", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Approve a new subcontractor");
  });

  it("Should create a new 'Approve a new subcontractor' PCR", () => {
    cy.getByLabel("Approve a new subcontractor").check();
  });
});
