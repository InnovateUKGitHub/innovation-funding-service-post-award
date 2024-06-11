import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import {
  approveSubcontractorBacklink,
  approveSubcontractorPromptValidation,
  approveSubcontractorTodoState,
  briefDescriptionInput,
  briefDescriptionSaved,
  changeStateToIncomplete,
  clickNoSaveContinue,
  clickYesNoContents,
  createApproveNewSubcontractor,
  currencyLengthValidation,
  decreaseBriefDescription,
  displayCompletedRequest,
  displaySavedRelationship,
  increaseBriefDescription,
  populateRelationshipSave,
  reduceJustificationSave,
  relationshipBoxInput,
  relationshipButtons,
  saveRelationshipBox,
  subcontractorSaveAndReturn,
  validateCountry,
  validateJustificationInput,
  validateNumericCurrency,
  validateRegistrationNumber,
  validateRelationshipBox,
  validateSubcontractorName,
  workingEditButtons,
} from "./subcontractor-steps";
import { markAsCompleteSave } from "../steps";

const pm = "james.black@euimeabs.test";

describe("PCR > Create 'Approve a new subcontractor'", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Approve a new subcontractor");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a new 'Approve a new subcontractor' PCR", createApproveNewSubcontractor);

  it("Should have a working backlink", approveSubcontractorBacklink);

  it("Should display the Approve new subcontractor in the correct To do state", approveSubcontractorTodoState);

  it("Should have guidance copy at the top of the page", () => {
    cy.paragraph(
      "Let us know if you are working with a new subcontractor. We will need to undertake viability checks, as stated in the application process.",
    );
  });

  it(
    "Should mark 'yes', save and continue, then mark as 'I agree with this change' and click 'Submit request' prompting validation",
    approveSubcontractorPromptValidation,
  );

  it("Should return to previous screen by clicking an Edit button", () => {
    cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
    [`A Zod 'z.literal("")' was not passed into this form.`, `A validation error occurred.`].forEach(error => {
      cy.getByQA("validation-summary").should("not.contain", error);
    });
    cy.getByLabel("Company name of subcontractor");
  });

  it("Should reload the page", () => {
    cy.reload();
  });

  it("Should save and return to request and check for the updated status", subcontractorSaveAndReturn);

  it("Should validate the length of the company name input field to 255 characters", validateSubcontractorName);

  it(
    "Should validate that a maximum of 20 characters can be entered into registration number",
    validateRegistrationNumber,
  );

  it("Should have 'Is there a relationship' Yes/No radio buttons", relationshipButtons);

  it("Should display an input box once 'yes' is selected", relationshipBoxInput);

  it("Should remove the input box if 'No' is selected", () => {
    cy.getByLabel("No").click();
    cy.get(".govuk-radios__conditional--hidden");
  });

  it("Should bring back the box when 'yes' is clicked", () => {
    cy.getByLabel("Yes").click();
    cy.get(".govuk-radios__conditional");
  });

  it("Should validate maximum 16k character input", validateRelationshipBox);

  it("Should save 16k characters and continue", saveRelationshipBox);

  it("Should return and display the populated box", displaySavedRelationship);

  it("Should allow you to click 'No' and then save and continue", clickNoSaveContinue);

  it("Click 'Yes' and the contents are no longer there.", clickYesNoContents);

  it("Should populate the relationship information and save", populateRelationshipSave);

  it(
    "Should validate 'Country where the subcontractor's work will be carried out' for 100 characters",
    validateCountry,
  );

  it("Should have a 'Brief description of work to be carried out by subcontractor' input", briefDescriptionInput);

  it("Should not display character counter", () => {
    cy.get(".character-count").contains("You have 0 characters remaining");
  });

  it("Should increase character count by one revealing character counter", increaseBriefDescription);

  it("Should reduce the number of characters to 255 and save and continue", decreaseBriefDescription);

  it("Should have saved the Brief description and the box is populated", briefDescriptionSaved);

  it("Should have a GBP currency input field that only accepts number input", validateNumericCurrency);

  it("Should have a 12 numeric character limitation on the currency input field", currencyLengthValidation);

  it("Should have a 'Justification' input which will accept 32k characters", validateJustificationInput);

  it("Should reduce and save and continue", reduceJustificationSave);

  it("Should display the completed request", displayCompletedRequest);

  it("Should have a working Edit button against each list item", workingEditButtons);

  it("Should have a mark as complete section", markAsCompleteSave);

  it("Should show the section as complete", () => {
    cy.get("li").contains("Approve a new subcontractor");
    cy.get("li").contains("Complete");
  });

  it("Should change the status to Incomplete by unticking 'I agree with this change'.", changeStateToIncomplete);
});
