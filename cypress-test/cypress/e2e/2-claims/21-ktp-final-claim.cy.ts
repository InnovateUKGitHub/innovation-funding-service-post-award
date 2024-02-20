import { fileTidyUp } from "common/filetidyup";
import { visitApp } from "../../common/visit";
import {
  accessOpenClaim,
  ktpCorrectCats,
  shouldShowProjectTitle,
  impactGuidance,
  ktpGuidanceWithoutSchedule3,
  nonFECMessagingFinalClaim,
} from "./steps";
import { fcClaimTidyUp } from "common/claimtidyup";

let date = new Date();
let comments = JSON.stringify(date);

const fcEmail = "s.shuang@irc.trde.org.uk.test";
const moEmail = "testman2@testing.com";

describe("claims > KTP > Final claim", () => {
  before(() => {
    visitApp({ path: "/projects/a0E2600000kTfqTEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
    fcClaimTidyUp("ABS EUI Medium Enterprise", "Submitted to Monitoring Officer");
    cy.switchUserTo(fcEmail);
    cy.selectTile("Claims");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Displays a claim in draft state", accessOpenClaim);

  it("Displays the project title", shouldShowProjectTitle);

  it("Should show Final claim message", () => {
    cy.validationNotification("This is the final claim.");
  });

  it("Should display KTP guidance messaging", () => {
    [
      "This project does not follow the normal grant calculation rules (costs claimed × funding award rate).",
      " The project and any partner may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
    ].forEach(guidance => {
      cy.validationNotification(guidance);
    });
  });

  it("Should contain the correct KTP cost categories", ktpCorrectCats);

  it("Should click 'Continue to claims documents' and land on the right page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should show Final claim message", () => {
    cy.validationNotification("This is the final claim.");
  });

  it("Should have KTP guidance messaging around document uploads", ktpGuidanceWithoutSchedule3);

  it("Should delete any documents that are present on the page.", () => fileTidyUp("Sarah Shuang"));

  it("Should continue to summary and display the correct messaging", () => {
    cy.clickOn("Continue to summary", { force: true });
    cy.heading("Claim summary");
  });

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should display correct messaging", () => nonFECMessagingFinalClaim());

  it("Should have a Supporting statement", () => {
    cy.get("legend").contains("Supporting statement");
    cy.get("#hint-for-comments").contains(
      "You must write a supporting statement for your claim. All supporting information for your monitoring officer and Innovate UK must be included here.",
    );
  });

  it("Should allow the claim to be submitted without a PCF uploaded.", () => {
    cy.clickOn("Submit claim");
    cy.heading("Claims");
    cy.clickOn("Back to project");
    cy.heading("Project overview");
  });

  it("Should switch user to MO and access the claim.", () => {
    cy.switchUserTo(moEmail);
    cy.selectTile("Claims");
    cy.get("td").contains("ABS EUI Medium Enterprise").siblings().contains("Review").click();
  });

  it("Should query the claim", () => {
    cy.getByLabel("Query claim").click();
    cy.get("textarea").type(comments);
    cy.clickOn("Send query");
    cy.heading("Claims");
  });
});
