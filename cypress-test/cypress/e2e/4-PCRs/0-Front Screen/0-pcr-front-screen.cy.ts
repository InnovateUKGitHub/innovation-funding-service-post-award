import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "../../../common/visit";
import {
  beforeYouSubmit,
  pcrCheckboxesWithHint,
  pcrCheckBoxes,
  shouldShowPastRequestsAccordion,
  shouldShowProjectTitle,
  backOutToProjOverview,
  switchToFc,
  correctPcrHeaders,
  existingPcrTable,
} from ".././steps";
const pmEmail = "james.black@euimeabs.test";

describe("PCR > Project Change Request front page", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
    cy.navigateToProject("328407");
  });

  it("Should access the Project change request tile", () => {
    cy.selectTile("Project change requests");
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

  it("Should click accordions", shouldShowPastRequestsAccordion);

  it("Should have a past requests message", () => {
    cy.paragraph("You have no past requests.");
  });

  it("Should check for existing PCRs and start creating a PCR", () => {
    pcrTidyUp("Draft");
  });

  it("Should display the project title", shouldShowProjectTitle);

  it("Should show the page title", () => {
    cy.heading("Start a new request");
  });

  it("Should display a 'before you submit' message", beforeYouSubmit);

  it("Should contain Select request types heading", () => {
    cy.get("legend").contains("Select request types");
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

  it("Should back out to the Project overview.", backOutToProjOverview);

  it("Should switch user to FC", switchToFc);

  it("Should access PCRs as FC", () => {
    cy.selectTile("Project change requests");
    cy.heading("Project change requests");
  });

  it("Should have correct PCR table headers", correctPcrHeaders);

  it("Should have a number of existing PCRs", existingPcrTable);

  it("Should have no buttons next to the PCRs for an FC", () => {
    ["Edit", "View"].forEach(button => {
      cy.get("a").contains(button).should("not.exist");
    });
  });

  it("Should have a 'Past requests' section", () => {
    cy.get(`[aria-expanded="false"]`);
    cy.button("Past requests").click();
  });

  it("Should display the accordion as open", () => {
    cy.get(`[aria-expanded="true"]`);
    cy.paragraph("You have no past requests.");
  });
});
