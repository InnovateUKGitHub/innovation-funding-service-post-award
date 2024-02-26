import { visitApp } from "common/visit";
import { fcClaimTidyUp } from "common/claimtidyup";
import {
  cleanUpExceedGolDocs,
  cleanUpExceedGolForecast,
  cleanUpOtherCosts5,
  exceedGolAccessClaim,
  exceedOtherCosts5,
  forecastShowsIARNotDue,
  iarProceedToSummary,
  uploadIAR,
} from "./steps";

import { fileTidyUp } from "common/filetidyup";

describe("Claims > Validate exceed GOL costs", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    fcClaimTidyUp("ABS EUI Medium Enterprise", "Submitted to Monitoring Officer");
  });

  after(() => {
    cleanUpOtherCosts5();
    cleanUpExceedGolDocs();
    cleanUpExceedGolForecast();
  });

  it("Should access the claim.", exceedGolAccessClaim);

  it("Should access Other costs 5 and update to exceed GOL costs", exceedOtherCosts5);

  it("Should display guidance around exceeding GOL costs for Other costs 5", () => {
    cy.validationNotification("You have exceeded the total eligible costs for these categories");
    cy.list("Other costs 5");
  });

  it("Should proceed to the documents section", () => {
    cy.clickOn("Continue to claims documents");
    cy.heading("Claim documents");
  });

  it("Should delete any documents on the page", () => fileTidyUp("Sarah Shuang"));

  it("Should upload an Independent Accountant's Report", uploadIAR);

  it(
    "Should proceed to the forecast table and check the IAR requirement flag has changed to No",
    forecastShowsIARNotDue,
  );

  it("Should enter a minus figure in Other costs period 5 to allow claim to proceed", () => {
    cy.getByAriaLabel("Other costs 5 Period 2").clear();
    cy.getByAriaLabel("Other costs 5 Period 2").type("-11801");
  });

  it("Should proceed to claim summary", iarProceedToSummary);

  it("Should attempt to submit, prompting validation that claim exceeds GOL costs", () => {
    cy.clickOn("Submit claim");
    cy.validationLink("You must reduce your claim to ensure the remaining eligible costs are zero or higher.");
  });
});
