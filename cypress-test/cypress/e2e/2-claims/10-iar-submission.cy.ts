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
  accessClaimNavigateToForecast,
  forecastShowsIARDue,
  forecastShowsIARNotDue,
} from "./steps";
describe("Claims > IAR Required - Submission", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    fcClaimTidyUp("Submitted to Monitoring Officer");
  });

  /**
   * Note there is no after block to change status back to Draft.
   * This is intentional as review test follows this test.
   */

  it("Should access the claim and proceed to Documents page.", iarProceedToDocs);

  it("Should have IAR document guidance", iarGuidance);

  it("Should delete any documents on the page", () => fileTidyUp("Sarah Shuang"));

  it("Should proceed to Claim summary page and attempt to submit, prompting validation", iarSubmitValidate);

  it("Should 'Save and return to claims' without validation prompting", () => {
    cy.button("Save and return to claims").click();
    cy.heading("Claims");
  });

  it("Should access the claim and navigate to Forecast page", accessClaimNavigateToForecast);

  it("Should check the forecast to show that IAR is due", forecastShowsIARDue);

  it("Should go back to the documents page", () => {
    cy.clickOn("Back to claims documents");
    cy.heading("Claim documents");
  });

  it("Should upload an Independent Accountant's Report", uploadIAR);

  it(
    "Should proceed to the forecast table and check the IAR requirement flag has changed to No",
    forecastShowsIARNotDue,
  );

  it("Should proceed to claim summary", iarProceedToSummary);

  it("Should not display Project Impact guidance", impactGuidance);

  it("Should click submit and proceed without validation", () => {
    cy.clickOn("Submit claim");
    cy.heading("Claims");
  });
});
