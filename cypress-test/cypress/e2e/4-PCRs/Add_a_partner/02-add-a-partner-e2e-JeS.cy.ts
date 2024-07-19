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
  swindonUniResults,
  requestHeadingDetailsHeading,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";
import {
  addPartnerContinue,
  attemptToPromptValidation,
  completeLocationForm,
  completeNameForm,
  nameSectionSubheadings,
  partnerRadioValidation,
  projectRoleRadio,
  saveAndSummary,
  summaryWithSubs,
  theDifferentTypes,
  validateNameForm,
  validateNameOfTown,
  validateNameOverLimit,
  validatePostcodeInput,
  validateWithoutFundingLevel,
  correctFundingLevelCopy,
  fundingLevelInputValidation,
  accessOtherPublicFunding,
  validateOtherSourceInput,
  accessPartnerAgreement,
  uploadTestFile,
  completeAcademicCostCatTable,
  leadAndResearch,
  saveJeSReturnPromptingValidation,
  jeSValidationNoOrganisation,
  jeSValidationNoFCName,
  jeSValidationNoPMName,
  jeSDetailsScreenComplete,
  jesDeleteCostCat,
  jesCompleteOtherSourceLine,
  jeScheckDetailsAgain,
  validateJesCostsFields,
} from "./add-partner-e2e-steps";
import { newCurrency } from "common/currency";

const pmEmail = "james.black@euimeabs.test";

describe("PCR >  Add a partner > E2E: Je-S", () => {
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

  it("Should have a back option", () => {
    cy.backLink("Back to project change requests");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Request' heading and 'Details' heading", requestHeadingDetailsHeading);

  it("Should show the Request number", () => {
    cy.get("dt.govuk-summary-list__key").contains("Request number");
  });

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

  it("Should select role 'Collaborator' and type 'Research' then 'Save and return to summary'", leadAndResearch);

  it("Should present a summary screen with correct subheadings", summaryWithSubs);

  it(
    "Should mark as complete and click 'Save and return to request', prompting validation",
    saveJeSReturnPromptingValidation,
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
    cy.get("legend").contains("Search for organisation");
  });

  it(
    "Should type 'University' in the search box and display 'Je-S search results' and the org 'Swindon University'",
    swindonUniResults,
  );

  it("Should return to summary page", () => {
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it(
    "Should now validate but this time no validation link will appear for Organisation, registration or registered address",
    jeSValidationNoOrganisation,
  );

  it("Should display Size as 'Academic'", () => {
    cy.getListItemFromKey("Size", "Academic");
  });

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
    cy.validationLink("Select project location.");
    cy.paragraph("Select project location.");
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
    jeSValidationNoOrganisation,
  );

  /**
   * Name section
   */
  it("Should access the Finance Contact First name section", () => {
    cy.getByQA("contact1Forename").contains("Edit").click();
    cy.get("h2").contains("Add person to organisation");
  });

  it("Should display the correct subheadings and copy", nameSectionSubheadings);

  it("Should complete the form and prompt validation", validateNameOverLimit);

  it("Should complete form at boundary of character limit", validateNameForm);

  it("Should complete the form and Save and return", completeNameForm);

  it("Should now validate but this time no validation link will appear for Name, number, email", jeSValidationNoFCName);

  it("Should access the PM name section", () => {
    cy.getByQA("contact2Forename").contains("Edit").click();
    cy.get("legend").contains("Project manager");
    cy.button("Use the same details as the finance contact").click();
    [
      ["First name", "Joseph"],
      ["Last name", "Dredd"],
      ["Phone number", "01234567890"],
      ["Email", "j.dredd@mc1justice.law"],
    ].forEach(([label, input]) => {
      cy.getByLabel(label).should("have.value", input);
    });
    cy.clickOn("Save and return to summary");
    cy.get("dt").contains("Project role");
  });

  it("Should validate without PM name link appearing", jeSValidationNoPMName);

  /**
   * Project costs for new partner section
   */
  it("Should access the Project costs for new partner section", () => {
    cy.getListItemFromKey("Project costs for new partner", "Edit").click();
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should validate the input fields for costs", validateJesCostsFields);

  it("Should display an academic cost category table", completeAcademicCostCatTable);

  it("Should save and return to summary", () => {
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it("Should display the saved total against the Project costs for new partner section", () => {
    cy.getListItemFromKey("Project costs for new partner", newCurrency.format(333.33 * 12));
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

  it("Should show the details entered are displayed on the summary screen", jeSDetailsScreenComplete);

  /**
   * Other sources of funding section
   */
  it("Should re-access 'Other public sector funding' and change", accessOtherPublicFunding);

  it("Should add a source and validate the inputs", validateOtherSourceInput);

  it("Should complete the other source line item", jesCompleteOtherSourceLine);

  it("Should check the Funding from other sources on Details page", jeScheckDetailsAgain);

  it("Should show that Project costs for new partner have been included on summary with correct totals", () => {
    [
      ["Project costs for new partner", newCurrency.format(333.33 * 12)],
      ["Other sources of funding?", "Yes"],
      ["Funding from other sources", "£1,000.00"],
      ["Funding level", "75.00%"],
      ["Funding sought", "£2,249.97"],
      ["Partner contribution to project", "£749.99"],
    ].forEach(([key, item]) => {
      cy.getListItemFromKey(key, item);
    });
  });

  it("Should go into costs again", () => {
    cy.getListItemFromKey("Project costs for new partner", "Edit").click();
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should reduce a cost category by £333.33 ", jesDeleteCostCat);

  it("Should save and return to project summary reflecting 333.33 less against costs", () => {
    cy.wait(500);
    cy.clickOn("Save and return to summary");
    cy.getListItemFromKey("Project costs for new partner", newCurrency.format(333.33 * 11));
  });

  /**
   * Partner agreement section
   */
  it("Should access the Partner agreement section", accessPartnerAgreement);

  it("Should display a clickable 'Learn more about files you can upload' message", () => {
    cy.learnFiles();
  });

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

  /**
   * TODO: Assert the tick box has value = true when completed.
   */
  it("Should return to Summary and assert that the tick is still true", () => {
    cy.get("a").contains("Add a partner").click();
  });
});
