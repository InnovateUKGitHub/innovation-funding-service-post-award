import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../../common/visit";
import {
  beforeYouSubmit,
  pcrCheckboxesWithHint,
  pcrCheckBoxes,
  shouldShowAllAccordion,
  shouldShowProjectTitle,
} from ".././steps";

describe("PCR > Project Change Request front page", () => {
  before(() => {
    visitApp({ path: "/projects/a0E2600000kSotUEAS/pcrs/dashboard" });
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a page heading", () => {
    cy.heading("Project change requests");
  });

  it("Should display a table containing any ongoing requests", () => {
    ["Request number", "Types", "Started", "Status", "Last updated"].forEach(header => {
      cy.tableHeader(header);
    });
  });

  it("Should click accordions", shouldShowAllAccordion);

  it("Should have a past requests message", () => {
    cy.get("p").contains("You have no past requests.");
  });

  it("Should check for existing PCRs and start creating a PCR", () => {
    pcrTidyUp("Reallocate project costs");
  });

  it("Should display the project title", shouldShowProjectTitle);

  it("Should show the page title", () => {
    cy.heading("Start a new request");
  });

  it("Should display a 'before you submit' message", beforeYouSubmit);

  it("Should contain Select request types heading", () => {
    cy.get("h2").contains("Select request types");
  });

  it("Should have guidance with each PCR type", pcrCheckboxesWithHint);

  it("Should not have a 'Learn about why some PCR types are missing'", () => {
    cy.get(".govuk-details__summary-text").contains("Learn about why some PCR types are missing").should("not.exist");
  });

  it("Should allow you to check the checkboxes", pcrCheckBoxes);

  it("Has a Create request button", () => {
    cy.get("button").contains("Create request");
  });

  it("Has a Cancel button", () => {
    cy.get("a.govuk-button--secondary").contains("Cancel");
  });
});
