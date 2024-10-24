import { visitApp } from "common/visit";
import {
  backToPcrs,
  backToRequest,
  onHoldDetails,
  onHoldGiveUsInfo,
  onHoldRequestDetails,
  workingNextArrow,
  workingPreviousArrow,
} from "../steps";

const monitoringOfficer = "testman2@testing.com";

describe("js disabled  > PCR >  Put project on hold > Review PCR", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: monitoringOfficer, jsDisabled: true });
    cy.navigateToProject("597638");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should navigate to the PCR section", () => {
    cy.selectTile("Project change requests");
    cy.heading("Project change requests");
  });

  it("Should access the PCR as Monitoring Officer", () => {
    cy.get("tr")
      .eq(2)
      .within(() => {
        cy.get("a").contains("Review").click();
      });
    cy.heading("Request");
  });

  it("Should have a working backlink", backToPcrs);

  it("Should have the correct project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should display the Details subheading and correct information", onHoldDetails);

  it("Should have a 'Give us information' section", onHoldGiveUsInfo);

  it("Should have 'Explain why you want to make the changes' section", () => {
    cy.get("h2").contains("Explain why you want to make the changes");
    cy.get("strong").contains("Complete");
  });

  it("Should access the 'Put project on hold' PCR", () => {
    cy.clickOn("a", "Put project on hold");
    cy.heading("Put project on hold");
  });

  it("Should have a correct working backlink", backToRequest);

  it("Should go back to 'Put project on hold' page", () => {
    cy.clickOn("a", "Put project on hold");
    cy.heading("Put project on hold");
  });

  it("Should have the correct project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should display the details of the request", () => {
    cy.getListItemFromKey("First day of pause", "1 Sep 2024");
    cy.getListItemFromKey("Last day of pause (if known)", "31 Oct 2024");
  });

  it("Should have a 'Next' arrow which takes the user to the reasoning section", workingNextArrow);

  it("Should have a correct working backlink", backToRequest);

  it("Should go back to the Put project on hold page ", () => {
    cy.clickOn("a", "Reasoning for Innovate UK");
    cy.heading("Reasons for Innovate UK");
  });

  it("Should have the correct project title", () => {
    cy.getByQA("page-title").contains("CYPRESS");
  });

  it("Should display the request details", onHoldRequestDetails);

  it("Should download the testfile.doc file", () => {
    cy.downloadFile("/api/documents/projectChangeRequests/a0E2600000omEFHEA2/a0G26000007wictEAA/06826000002bq9QAAQ/");
  });

  it("Should have a working 'Previous' arrow link", () => workingPreviousArrow("Put project on hold"));
});
