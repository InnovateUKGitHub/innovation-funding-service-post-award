import { visitApp } from "common/visit";
import { pcrTidyUp } from "common/pcrtidyup";
import { removeManyPartners, shouldShowProjectTitle } from "../steps";
import {} from "e2e/9-loans/steps";
const pm = "b.potter@test.co.uk";

describe("PCR > Remove partner > Many partners", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kTirsEAC/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });

  after(() => {
    cy.deletePcr("154870");
  });

  it("Should create a Remove partner PCR", () => {
    cy.createPcr("Remove a partner");
  });

  it("Should click the Remove partner link to begin editing the PCR", () => {
    cy.get("a").contains("Remove a partner").click();
    cy.heading("Remove a partner");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have a subheading for 'Select partner to remove'", () => {
    cy.get("legend").contains("Select partner to remove");
  });

  it(
    "Should click all partners in turn and assert that the last one correctly displays on the next screen",
    removeManyPartners,
  );
});
