import { visitApp } from "common/visit";
import { fcClaimTidyUp } from "common/claimtidyup";
import { fileTidyUp } from "common/filetidyup";
import { iarGuidance, iarProceedToDocs, iarProceedToSummary, iarSubmitValidate, uploadIAR } from "./steps";
describe("Claims > IAR Required - Submission", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSvOGEA0/claims/dashboard" });
    fcClaimTidyUp("Submitted to Monitoring Officer");
  });

  it("Should access the claim and proceed to Documents page.", iarProceedToDocs);

  it("Should have IAR document guidance", iarGuidance);

  it("Should delete any documents on the page", () => fileTidyUp("Sarah Shuang"));

  it("Should proceed to Claim summary page and attempt to submit, prompting validation", iarSubmitValidate);

  it("Should proceed to Claim documents page via the link on the page", () => {
    cy.clickOn("Edit claim documents");
    cy.heading("Claim documents");
  });

  it("Should upload an Independent Accountant's Report", uploadIAR);

  it("Should proceed to claim summary", iarProceedToSummary);

  it("Should click submit and proceed without validation", () => {
    cy.clickOn("Submit claim");
    cy.heading("Claims");
  });
});
