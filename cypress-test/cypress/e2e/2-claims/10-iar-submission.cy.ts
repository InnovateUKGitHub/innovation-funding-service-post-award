import { visitApp } from "common/visit";
import { fcClaimTidyUp } from "common/claimtidyup";
import { fileTidyUp } from "common/filetidyup";
import {
  iarGuidance,
  iarProceedToDocs,
  iarProceedToSummary,
  iarSubmitValidate,
  uploadIAR,
  impactGuidance,
  forecastShowsIARDue,
  forecastShowsIARNotDue,
  claimsDocUpload,
  accessClaimNavigateToForecastPage,
} from "./steps";
import { forecastTidyUp, otherCost5TidyUp } from "common/costCleanUp";
describe("Claims > IAR Required - Submission", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    fcClaimTidyUp("ABS EUI Medium Enterprise", "Submitted to Monitoring Officer");
  });

  /**
   * Note there is no after block to change status back to Draft.
   * This is intentional as review test follows this test.
   */

  it("Should access the claim", () => {
    cy.switchUserTo("s.shuang@irc.trde.org.uk.test");
    cy.selectTile("Claims");
    cy.get("td").contains("Period 1").siblings().contains("a", "Edit").click();
    cy.heading("Costs to be claimed");
    cy.wait(2000);
  });

  it("Should clean up Other costs 5 if needed", () => otherCost5TidyUp());

  it("Should continue to Documents page.", iarProceedToDocs);

  it("Should have IAR document guidance", iarGuidance);

  it("Should delete any documents on the page", () => fileTidyUp("Sarah Shuang"));

  it("Should upload evidence", claimsDocUpload);

  it("Should proceed to Claim summary page and check the file appears", () => {
    cy.clickOn("Continue to update forecast");
    cy.heading("Update forecast");
    cy.clickOn("Continue to summary");
    cy.heading("Claim summary");
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("td:nth-child(1)").contains("testfile.doc");
      });
  });

  it("Should attempt to submit, prompting validation", iarSubmitValidate);

  it("Should 'Save and return to claims' without validation prompting", () => {
    cy.button("Save and return to claims").click();
    cy.heading("Claims");
  });

  it("Should access the claim again and navigate to Forecast page", accessClaimNavigateToForecastPage);

  it("Should check for correct forecast and clear up if needed", () => forecastTidyUp("£79,200.00"));

  it("Should check the forecast to show that IAR is due", forecastShowsIARDue);

  it("Should go back to the documents page", () => {
    cy.clickOn("Back to claims documents");
    cy.heading("Claim documents");
  });

  it("Should delete the existing file", () => fileTidyUp("Sarah Shuang"));

  it("Should upload an Independent Accountant's Report", uploadIAR);

  it(
    "Should proceed to the forecast table and check the IAR requirement flag has changed to No",
    forecastShowsIARNotDue,
  );

  it("Should check that forecasts for Other costs 5 are accurate", () => forecastTidyUp("-£9,701.00"));

  it("Should proceed to claim summary", iarProceedToSummary);

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should click submit and proceed without validation", () => {
    cy.clickOn("Submit claim");
    cy.heading("Claims");
  });
});
