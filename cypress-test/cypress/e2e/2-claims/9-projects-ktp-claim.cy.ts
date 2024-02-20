import { fileTidyUp } from "common/filetidyup";
import { visitApp } from "../../common/visit";
import {
  accessOpenClaim,
  ktpAssociateEmployment,
  ktpCorrectCats,
  ktpGuidance,
  shouldShowProjectTitle,
  nonFECMessaging,
  costCatAwardOverrideMessage,
  impactGuidance,
  uploadDate,
  ktpTopThreeRows,
  ktpForecastCategories,
} from "./steps";
import { fcClaimTidyUp } from "common/claimtidyup";

let date = new Date();
let comments = JSON.stringify(date);

const fcEmail = "james.black@euimeabs.test";
const moEmail = "testman2@testing.com";

describe("claims > KTP", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "/projects/a0E2600000kTfqTEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
    fcClaimTidyUp("EUI Small Ent Health", "Submitted to Monitoring Officer");
    cy.switchUserTo(fcEmail);
    cy.selectTile("Claims");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Displays a claim in draft state", accessOpenClaim);

  it("Displays the project title", shouldShowProjectTitle);

  it("Should display 'Costs to be claimed' title and guidance messaging", () => {
    cy.heading("Costs to be claimed");
    nonFECMessaging();
    costCatAwardOverrideMessage("associate employment", "70%");
    costCatAwardOverrideMessage("travel and subsistence", "20%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
  });

  it("Should contain the correct KTP cost categories", ktpCorrectCats);

  it("Should click into the 'Associate Employment' category and take you to that page", () => {
    cy.clickOn("td", "Associate Employment");
  });

  it("Should have Associate Employment page heading and guidance", () => {
    cy.heading("Associate Employment");
    nonFECMessaging();
    costCatAwardOverrideMessage("travel and subsistence", "20%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
    cy.list("This cost category is paid at a rate of 70% rather than your normal award rate");
  });

  it("Should click 'Back to claim'", () => {
    cy.clickOn("Back to claim");
  });

  it("Should click into 'Travel and subsistence' and check the copy", () => {
    cy.clickOn("Travel and subsistence");
    cy.heading("Travel and subsistence");
    cy.list("This cost category is paid at a rate of 20% rather than your normal award rate");
    costCatAwardOverrideMessage("associate employment", "70%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
  });

  it("Should click 'Back to claim'", () => {
    cy.clickOn("Back to claim");
  });

  it("Should click 'Continue to claims documents' and land on the right page", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should have KTP guidance messaging around document uploads", ktpGuidance);

  it("Should delete any documents that are present on the page.", () => fileTidyUp("James Black"));

  it("Should click 'Continue to update forecast' and ensure correct cost categories are listed", ktpForecastCategories);

  it("Should display the KTP-specific top three rows of the Forecast table", ktpTopThreeRows);

  it(
    "Should update 'Associate Employment' fields with a figure and check the new costs are calculated",
    ktpAssociateEmployment,
  );

  it("Should continue to summary.", () => {
    cy.clickOn("Continue to summary", { force: true });
    cy.heading("Claim summary");
  });

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should display correct messaging", () => {
    nonFECMessaging();
    costCatAwardOverrideMessage("associate employment", "70%");
    costCatAwardOverrideMessage("travel and subsistence", "20%");
    costCatAwardOverrideMessage("consumables", "11.11%");
    costCatAwardOverrideMessage("associate development", "5%");
  });

  it("Should prompt you to upload a document", () => {
    cy.paragraph("You must upload a supporting document before you can submit this claim.");
    cy.get("a").contains("Edit claim documents");
  });

  it("Should have a Supporting statement", () => {
    cy.get("legend").contains("Supporting statement");
    cy.get("#hint-for-comments").contains(
      "You must write a supporting statement for your claim. All supporting information for your monitoring officer and Innovate UK must be included here.",
    );
  });

  it("Should click Submit and prompt validation that Schedule 3 is required", () => {
    cy.clickOn("Submit claim");
    cy.validationLink("You must upload a schedule 3 before you can submit this claim.");
  });

  it("Should click Edit claim documents and upload an IAR", () => {
    cy.clickOn("Edit claim documents");
    cy.heading("Claim documents");
    cy.fileInput("testfile.doc");
    cy.getByLabel("Type").select("Independent accountant’s report");
    cy.clickOn("Upload documents");
    cy.validationNotification("has been uploaded.");
  });

  it("Should display the document", () => {
    ["testfile.doc", "Independent accountant’s report", uploadDate, "0KB", "James Black"].forEach(
      (tableData, index) => {
        cy.get("tr")
          .eq(1)
          .within(() => {
            cy.get(`td:nth-child(${index + 1})`).contains(tableData);
          });
      },
    );
  });

  it("Should continue to the Forecast page", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
  });

  it("Should navigate to Summary page", () => {
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should click Submit and prompt validation that Schedule 3 is required", () => {
    cy.clickOn("Submit claim");
    cy.validationLink("You must upload a schedule 3 before you can submit this claim.");
  });

  it("Should click Edit claim documents and upload an Schedule 3", () => {
    cy.clickOn("Edit claim documents");
    cy.heading("Claim documents");
    cy.fileInput("testfile.doc");
    cy.getByLabel("Type").select("Schedule 3");
    cy.clickOn("Upload documents");
    cy.validationNotification("has been uploaded.");
  });

  it("Should navigate to Claim summary", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
  });

  it("Should click Submit and allow the claim to submit", () => {
    cy.clickOn("Submit claim");
    cy.heading("Claims");
    cy.get("td").contains("EUI Small Ent Health").siblings().contains("Submitted to Monitoring Officer");
  });

  it("Should switch user to MO and access the claim", () => {
    cy.switchUserTo(moEmail);
    cy.wait(2000);
    cy.clickOn("Review");
    cy.heading("Claim");
  });

  it("Should query the claim", () => {
    cy.getByLabel("Query claim").click();
    cy.get("textarea").type(comments);
    cy.clickOn("Send query");
    cy.heading("Claims");
  });

  it("Should switch user to FC and re-access claim", () => {
    cy.switchUserTo(fcEmail);
    cy.wait(2000);
    cy.clickOn("Edit");
    cy.heading("Costs to be claimed");
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should clear up any files uploaded.", () => fileTidyUp("James Black"));
});
