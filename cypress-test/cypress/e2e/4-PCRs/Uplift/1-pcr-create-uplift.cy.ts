import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import { uploadDate } from "e2e/2-claims/steps";

const pm = "james.black@euimeabs.test";

describe("PCR > Uplift > Create", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kTirsEAC/pcrs/dashboard" });
    pcrTidyUp("Draft");
  });

  it("Should display an Uplift PCR in progress", () => {
    ["Uplift", uploadDate, "In progress", uploadDate, "View"].forEach((cell, index) => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(cell);
        });
    });
  });
});
