import { fileTidyUp } from "common/filetidyup";
import { visitApp } from "common/visit";
import {
  editClaimDocUploadIAR,
  editClaimDocUploadRandomFiles,
  finalClaimGuidance,
  navigateToClaimsTile,
  removeIAR,
  submitButtonDisabled,
  submitButtonEnabled,
} from "./steps";

const fcEmail = "this'is'a'test@innovateuk.gov.uk.bjssdev";

describe("claims > final claim with IAR required", () => {
  before(() => {
    visitApp({ asUser: fcEmail });
    cy.navigateToProject("879546");
  });

  it("Should navigate to the claims tile and access the open claim", navigateToClaimsTile);

  it("Should notify the user that this is the final claim", () => {
    cy.getByAriaLabel("info message").contains("This is the final claim.");
  });

  it("Should continue to claims documents", () => {
    cy.button("Continue to claims documents").click();
    cy.heading("Claim documents");
  });

  it("Should contain guidance surrounding final Claim documents", finalClaimGuidance);

  it("Should check for an existing document and delete it if there is one", () => fileTidyUp("Neil O'Reilly"));

  it("Should continue to the Summary page", () => {
    cy.get("a").contains("Continue to summary").click();
    cy.heading("Claim summary");
  });

  it("Should have a final claim info message", () => {
    cy.getByAriaLabel("info message").contains("This is the final claim.");
  });

  it("Should show an error message because an IAR has not been uploaded", () => {
    cy.getByAriaLabel("error message").contains(
      "You must upload a supporting document before you can submit this claim.",
    );
    cy.get("a").contains("Edit claim documents");
  });

  it("Should have a disabled submit button", () => {
    cy.button("Submit claim").should("have.attr", "disabled");
  });

  it(
    "Should click into 'Edit claim documents' and upload a number of files that are NOT an IAR",
    editClaimDocUploadRandomFiles,
  );

  it("Should continue to the Claim summary screen and check the submit button is still disabled", submitButtonDisabled);

  it("Should click into the 'Edit claim documents' link and upload an IAR", editClaimDocUploadIAR);

  it("Should display the uploaded file", () => {
    cy.reload;
    cy.get("tr").contains("Neil O'Reilly");
  });

  it("Should continue to the Claim summary screen and check the submit button is now enabled", submitButtonEnabled);

  it("Should navigate to claim documents and delete the file that was uploaded", removeIAR);
});
