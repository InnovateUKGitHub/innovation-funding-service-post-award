import { visitApp } from "common/visit";
import { pcrStatusChange } from "common/pcrStatusChange";
import {
  leaveCommentQuery,
  switchUserMoReviewPcr,
  pcrStatusTable,
  switchUserCheckForComments,
  enterCommentsSubmit,
  switchToMoCheckComments,
  shouldShowProjectTitle,
} from "./steps";

describe("PCR > In Review", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/pcrs/dashboard" });
    pcrStatusChange("Queried by Monitoring Officer");
  });

  it("Should switch user to Monitoring Officer and open the submitted PCR", switchUserMoReviewPcr);

  it("Should check that more than 10 status changes are displayed for the MO", pcrStatusTable);

  it("Should leave a comment and query the PCR", leaveCommentQuery);

  it("Should switch the user to PM and re-submit the claim with comments", switchUserCheckForComments);

  it("Should check that more than 10 status changes are displayed for the PM.", pcrStatusTable);

  it("Should enter comments and re-submit", enterCommentsSubmit);

  it("Should display the PCR submission screen heading", () => {
    cy.heading("Project change request submitted");
  });

  it("Should have a project title", shouldShowProjectTitle);

  it("Should have a backlink", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should have a SLA notification message at the top", () => {
    [
      "Your project change request has been submitted.",
      "Please note there is a 30-day Service Level Target from submission of your request to Innovate UK, through to approval of the change(s).",
    ].forEach(successMsg => {
      cy.getByAriaLabel("success message").contains(successMsg);
    });
  });

  it("Should have request number, request type, request start date, status and last updated list", () => {
    [
      ["Request number", "10"],
      ["Request type", "Change project scope"],
      ["Request type", "Reallocate project costs"],
      ["Request started", "5 July 2023"],
      ["Request status", "Submitted to Monitoring Officer"],
      ["Request last updated", "2023"],
    ].forEach(([requestItem, requestDetail]) => {
      cy.get("dt").contains(requestItem).siblings().contains(requestDetail);
    });
  });

  it("Should have a review PCR link", () => {
    cy.get("a").contains("Review request").click();
    cy.heading("Request");
    cy.go("back");
  });

  it("Should have 'Return to project change requests' button", () => {
    cy.button("Return to project change requests").click();
    cy.heading("Project change requests");
  });

  it("Should switch user back to MO and check for comments", switchToMoCheckComments);
});
