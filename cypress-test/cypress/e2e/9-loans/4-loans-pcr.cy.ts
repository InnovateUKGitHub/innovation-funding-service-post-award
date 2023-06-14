import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../common/visit";
import {
  loansPcrCheckBoxes,
  loansPcrCheckboxesWithHint,
  submitCancelButtons,
  deletePcr,
  assertForMissingPcr,
} from "./steps";
const pmEmail = "james.black@euimeabs.test";

describe("Loans project > PCR", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/dashboard" });
    pcrTidyUp("Change project scope");
  });
  after(deletePcr);

  it("Should have a 'Start new request heading'", () => {
    cy.get("h1").contains("Start a new request");
  });

  it("Should have a back link", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should have a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should have PCR checkboxes with hints", loansPcrCheckboxesWithHint);

  it("Should not have a 'Learn about why some PCR types are missing'", () => {
    cy.get(".govuk-details__summary-text").contains("Learn about why some PCR types are missing").should("not.exist");
  });

  it("Should check each checkbox in turn and then uncheck", loansPcrCheckBoxes);

  it("Should have a 'Create request' and 'Cancel' button", submitCancelButtons);

  it(
    "Should assert for 'Learn about why some PCR types are missing' by creating a PCR, saving and then creating another",
    assertForMissingPcr,
  );
});
