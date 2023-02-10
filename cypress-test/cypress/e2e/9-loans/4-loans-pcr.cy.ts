import { visitApp } from "../../common/visit";
import { loansPcrCheckBoxes, loansPcrGuidance, loansPcrTypes, submitCancelButtons } from "./steps";

const fcEmail = "wed.addams@test.test.co.uk";

describe("Loans project > PCR", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kTcmIEAS/pcrs/create" });
  });

  it("Should have a 'Start new request heading'", () => {
    cy.get("h1").contains("Start a new request");
  });

  it("Should have a back link", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should have a project title", () => {
    cy.getByQA("page-title-caption").contains("CYPRESS_LOANS_DO_NOT_USE");
  });

  it("Should have PCR guidance", loansPcrGuidance);

  it("Should have an information section showing the different PCR types available", loansPcrTypes);

  it("Should check each checkbox in turn and then uncheck", loansPcrCheckBoxes);

  it("Should have a 'Create request' and 'Cancel' button", submitCancelButtons);
});
