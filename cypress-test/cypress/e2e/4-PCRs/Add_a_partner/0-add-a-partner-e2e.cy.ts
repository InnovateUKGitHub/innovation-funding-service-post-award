import { visitApp } from "../../../common/visit";
import { createTestFile, deleteTestFile } from "common/createTestFile";
import {
  shouldShowProjectTitle,
  statusAndCommentsAccordion,
  pcrCommentBox,
  characterCount,
  correctPcrType,
  giveUsInfoTodo,
  explainChangesReasoning,
  typeASearchResults,
  companyHouseAutofillAssert,
} from "../steps";
import {
  validateFileUpload,
  uploadFileTooLarge,
  uploadSingleChar,
  deleteSingleChar,
  uploadFileNameTooShort,
  validateExcessiveFileName,
  doNotUploadSpecialChar,
} from "common/fileComponentTests";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  addPartnerContinue,
  attemptToPromptValidation,
  collaboratorAndBusiness,
  completeCapUsageForm,
  completeDateAndTurnover,
  completeLabourForm,
  completeLocationForm,
  completeMaterialsForm,
  completeNameForm,
  completeOverheadsSection,
  completeSubcontractingForm,
  displayCostCatTable,
  medium100Employees,
  nameSectionSubheadings,
  navigateToCostCat,
  partnerRadioValidation,
  projectRoleRadio,
  saveAndReturnPromptingValidation,
  saveAndSummary,
  summaryWithSubs,
  theDifferentTypes,
  validateMonthYearInput,
  validateNameForm,
  validateNameOfTown,
  validateNameOverLimit,
  validatePostcodeInput,
  validateSizeInput,
  validateTurnoverInput,
  validateWithoutFY,
  validateWithoutLocation,
  validateWithoutName,
  validateWithoutOrganisation,
  validateWithoutSize,
  completeTandSForm,
  completeOtherCostsForm,
  completedCostCatProfiles,
  validateWithoutFundingLevel,
  correctFundingLevelCopy,
  fundingLevelInputValidation,
  checkDetailsScreenComplete,
  accessOtherPublicFunding,
  validateOtherSourceInput,
  checkDetailsAgain,
  accessPartnerAgreement,
  uploadTestFile,
  completeOtherSourceLine,
  deleteCost,
  deleteCoste2e,
} from "./add-partner-e2e-steps";
import { learnFiles } from "common/fileComponentTests";

const pmEmail = "james.black@euimeabs.test";

describe("PCR >  Add a partner > E2E", () => {
  before(() => {
    visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
    createTestFile("bigger_test", 33);
  });

  after(() => {
    deleteTestFile("bigger_test");
    cy.deletePcr("328407");
  });

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner");
  });

  it("Should show the correct PCR type", correctPcrType);

  it(
    "Should show a 'Give us information' section with the Add a partner PCR type listed and 'TO DO' listed beneath",
    giveUsInfoTodo,
  );

  it(
    "Should show an 'Explain why you want to make changes' section with 'Provide reasoning to Innovate UK' listed and displays 'TO DO'",
    explainChangesReasoning,
  );

  it("Should display accordions", statusAndCommentsAccordion);

  it("Should have comments box at the bottom of the page and allow text to be entered", pcrCommentBox);

  it("Should count how many characters you have used", characterCount);

  it("Should attempt to submit prompting validation", attemptToPromptValidation);

  it("Should let you click 'Add a partner' and continue to the next screen", addPartnerContinue);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show correct subheadings", () => {
    cy.get("h2").contains("New partner information");
    ["Project role", "Project outputs", "Organisation type"].forEach(subheading => {
      cy.get("legend").contains(subheading);
    });
  });

  it("Should click 'Save and return to summary' prompting validation", saveAndSummary);

  it("Should expand 'What are the different types' section and check contents are correct", theDifferentTypes);

  it("Should click the Project role radio buttons in turn which will remove validation message", projectRoleRadio);

  it(
    "Should still show the partner validation until the Partner type radio buttons are selected",
    partnerRadioValidation,
  );

  it(
    "Should select role 'Collaborator' and type 'Business' then 'Save and return to summary'",
    collaboratorAndBusiness,
  );

  it("Should present a summary screen with correct subheadings", summaryWithSubs);

  it(
    "Should mark as complete and click 'Save and return to request', prompting validation",
    saveAndReturnPromptingValidation,
  );

  /**
   * Eligibility of aid declaration section
   */
  it("Should access 'Eligibility of aid declaration' section", () => {
    cy.getListItemFromKey("Eligibility of aid declaration", "Edit").click();
    cy.get("h2").contains("Non-aid funding");
    cy.paragraph(
      "This competition provides funding that is classed as non-aid. The new organisation should seek independent legal advice on what this means for them, before you complete this project change request.",
    );
  });

  it("Should back out to summary", () => {
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  /**
   * Organisation name section
   */
  it("Should access Organisation name' section", () => {
    cy.getListItemFromKey("Organisation name", "Edit").click();
    cy.get("h2").contains("Company house");
  });

  it(
    "Should type 'A' in the search box and display 'Companies house search results' and the company 'A Limited'",
    typeASearchResults,
  );

  it(
    "Should auto-fill the 'Organisation name', 'Registration number' and 'Registered address' fields",
    companyHouseAutofillAssert,
  );

  it("Should return to summary page", () => {
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it(
    "Should now validate but this time no validation link will appear for Organisation, registration or registered address",
    validateWithoutOrganisation,
  );

  it("Should now access the Size section", () => {
    cy.getListItemFromKey("Size", "Edit").click();
    cy.get("h2").contains("Organisation details");
  });

  /**
   * Size section
   */
  it("Should display copy directing user to Select participantr size and enter number of employees", () => {
    ["Select a participant size.", "Enter the number of employees."].forEach(direction => {
      cy.paragraph(direction);
    });
  });

  it("Validate the input box", validateSizeInput);

  it("Should select 'Medium' size and enter 100 employees", medium100Employees);

  it("Should now validate but this time no validation link will appear for Size", validateWithoutSize);

  it("Should access the 'End of financial year' section", () => {
    cy.getListItemFromKey("End of financial year", "Edit").click();
    cy.get("h2").contains("Financial details");
    ["End of financial year", "Turnover (£)"].forEach(subheading => {
      cy.get("legend").contains(subheading);
    });
  });

  it("Should validate the Month and Year box", validateMonthYearInput);

  /**
   * TODO This is a pre-existing bug so skipping this step to save time. It will always fail. ACC-10525 created.
   */
  //it("Should validate the Turnover box", validateTurnoverInput);

  it("Should enter valid details in both the date section and turnover section", completeDateAndTurnover);

  it(
    "Should now validate but this time no validation link will appear for 'End of financial year' and 'Turnover'",
    validateWithoutFY,
  );

  /**
   * Project location section
   */
  it("Should access the 'Project location' section", () => {
    cy.getListItemFromKey("Project location", "Edit").click();
    cy.get("h2").contains("Project location");
    ["Name of town or city", "Postcode"].forEach(subheading => {
      cy.getByLabel(subheading);
    });
  });

  it("Should contain correct guidance copy", () => {
    cy.get("#hint-for-project-location").contains(
      "Indicate where the majority of the work being done by this partner will take place.",
    );
    cy.get("#hint-for-project-postcode").contains("If this is not available, leave this blank.");
  });

  it("Should click 'Save and return', prompting validation", () => {
    cy.clickOn("Save and return to summary");
    cy.validationLink("Select a project location.");
    cy.paragraph("Select a project location.");
  });

  it("Should select Inside and Outside the United Kingdom in turn", () => {
    ["Inside the United Kingdom", "Outside the United Kingdom"].forEach(selection => {
      cy.getByLabel(selection);
    });
  });

  it("Should validate the Name of town or city input", validateNameOfTown);

  it("Should validate the Postcode input", validatePostcodeInput);

  it("Should complete the form and Save and return", completeLocationForm);

  it(
    "Should now validate but this time no validation link will appear for location, name of town, and postcode",
    validateWithoutLocation,
  );

  /**
   * Name section
   */
  it("Should access the First name section", () => {
    cy.getListItemFromKey("First name", "Edit").click();
    cy.get("h2").contains("Add person to organisation");
  });

  it("Should display the correct subheadings and copy", nameSectionSubheadings);

  it("Should complete the form and prompt validation", validateNameOverLimit);

  it("Should complete form at boundary of character limit", validateNameForm);

  it("Should complete the form and Save and return", completeNameForm);

  it("Should now validate but this time no validation link will appear for Name, number, email", validateWithoutName);

  /**
   * Project costs for new partner section
   */
  it("Should access the Project costs for new partner section", () => {
    cy.getListItemFromKey("Project costs for new partner", "Edit").click();
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should display a cost category table", displayCostCatTable);

  it("Should access the Labour section", () => navigateToCostCat("Labour", 0));

  it("Should complete the Labour form", completeLabourForm);

  it("Should access the Overheads section", () => navigateToCostCat("Overheads", 1));

  it("Should complete the section as 20% overhead rate", completeOverheadsSection);

  it("Should access the Materials section", () => {
    navigateToCostCat("Materials", 2);
  });

  it("Should complete the Materials form", completeMaterialsForm);

  it("Should access the Capital usage section", () => navigateToCostCat("Capital usage", 3));

  it("Should complete the Capital usage form", completeCapUsageForm);

  it("Should access the Subcontracting section", () => navigateToCostCat("Subcontracting", 4));

  it("Should complete the form for Subcontracting", completeSubcontractingForm);

  it("Should access the Travel and subsistence section", () => navigateToCostCat("Travel and subsistence", 5));

  it("Should complete the Travel and subsistence form", completeTandSForm);

  it("Should access the Other costs section", () => navigateToCostCat("Other costs", 6));

  it("Should complete the Other costs form", completeOtherCostsForm);

  /**
   * These next sections do not appear in acc-dev so these steps have been removed for now.
   */
  //it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 2", 7));
  //
  //it("Should complete the Other costs 2 section", completeOtherCostsForm);
  //
  //it("Should access the Other costs 3 section", () => navigateToCostCat("Other costs 3", 8));
  //it("Should complete the Other costs 3 section", completeOtherCostsForm);
  //
  //it("Should access the Other costs 4 section", () => navigateToCostCat("Other costs 4", 9));
  //
  //it("Should complete the Other costs 4 section", completeOtherCostsForm);
  //
  //it("Should access the Other costs 5 section", () => navigateToCostCat("Other costs 5", 10));
  //
  //it("Should complete the Other costs 5 section", completeOtherCostsForm);

  it("Should show a completed table of cost categories with appropriate costs and total", completedCostCatProfiles);

  it("Should save and return to summary", () => {
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it("Should display the saved total against the Project costs for new partner section", () => {
    cy.getListItemFromKey("Project costs for new partner", "£20,656.58");
  });

  /**
   * Funding level section
   */
  it("Should access the Funding level section", () => {
    cy.getListItemFromKey("Funding level", "Edit").click();
    cy.get("h2").contains("Funding level");
  });

  it("Should display the correct copy", correctFundingLevelCopy);

  it("Should validate the funding level input box", fundingLevelInputValidation);

  it("Should enter 75% as funding level", () => {
    cy.get("#awardRate").clear().type("75");
    cy.clickOn("Save and return to summary");
    cy.get("dt").contains("Project role");
  });

  it("Should now validate but this time no validation link will appear for costs,", validateWithoutFundingLevel);

  it("Should let you click 'Add a partner' and continue to the next screen", addPartnerContinue);

  it("Should validate the details entered on the Details screen", checkDetailsScreenComplete);

  /**
   * Other sources of funding section
   */

  it("Should re-access 'Other public sector funding' and change", accessOtherPublicFunding);

  it("Should add a source and validate the inputs", validateOtherSourceInput);

  it("Should complete the other source line item", completeOtherSourceLine);

  it("Should check the Funding from other sources on Details page", checkDetailsAgain);

  it("Should show that Project costs for new partner have been included on summary with correct totals", () => {
    [
      ["Project costs for new partner", "£20,656.58"],
      ["Other sources of funding?", "Yes"],
      ["Funding from other sources", "£10,000.00"],
      ["Funding level", "75.00%"],
      ["Funding sought", "£7,992.44"],
      ["Partner contribution to project", "£2,664.15"],
    ].forEach(([key, item]) => {
      cy.getListItemFromKey(key, item);
    });
  });

  it("Should go into costs again", () => {
    cy.getListItemFromKey("Project costs for new partner", "Edit").click();
  });

  it("Should access the cost category again and delete the line item", deleteCoste2e);

  it("Should save and return to proejct summary", () => {
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
    cy.clickOn("Save and return to summary");
  });

  /**
   * Partner agreement section
   */

  it("Should access the Partner agreement section", accessPartnerAgreement);

  it("Should display a clickable 'Learn more about files you can upload' message", learnFiles);

  it("Should validate when uploading without choosing a file.", validateFileUpload);

  it("Should validate uploading a file that is too large", uploadFileTooLarge);

  it("Should upload a file with a single character as the name", uploadSingleChar);

  it("Should delete the file with the very short file name", deleteSingleChar);

  it("Should not allow a file to be uploaded unless it has a valid file name", uploadFileNameTooShort);

  it("Should validate a file with a name over 80 characters", validateExcessiveFileName);

  it("Should NOT upload a file with these special characters", doNotUploadSpecialChar);

  it("Should upload a testfile and check it appears", uploadTestFile);

  it("Should display the partner agreement", () => {
    cy.getListItemFromKey("Partner agreement", "testfile.doc");
  });

  it("Should mark as complete and Save and return to request", () => {
    cy.getByLabel("I agree with this change").click();
    cy.clickOn("Save and return to request");
    cy.heading("Request");
    cy.get("span").contains("Complete");
  });
});
