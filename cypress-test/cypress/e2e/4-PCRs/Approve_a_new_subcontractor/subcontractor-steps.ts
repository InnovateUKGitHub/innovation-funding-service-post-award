import { loremIpsum100Char, loremIpsum16k, loremIpsum32k } from "common/lorem";

export const contractorName255 =
  "If you ever need a reason to go to the office in Swindon, consider the fact that every third wednesday of the month, Pippin's donuts comes into the office and sells its lovely goods. If you ever need a reason to go to the office in Swindon, consider the f";
export const contractorName254 =
  "If you ever need a reason to go to the office in Swindon, consider the fact that every third wednesday of the month, Pippin's donuts comes into the office and sells its lovely goods. If you ever need a reason to go to the office in Swindon, consider the f";

export const createApproveNewSubcontractor = () => {
  cy.getByLabel("Approve a new subcontractor").check();
  cy.get(".govuk-hint").contains("If you are requesting a change in subcontractor, please select this option.");
  cy.wait(500);
  cy.button("Create request").click();
  cy.heading("Request");
};

export const approveSubcontractorBacklink = () => {
  cy.heading("Request");
  cy.get("li").contains("Approve a new subcontractor").click();
  cy.heading("Approve a new subcontractor");
  cy.backLink("Back to request").click();
  cy.heading("Request");
};

export const approveSubcontractorTodoState = () => {
  cy.get("li").contains("Approve a new subcontractor");
  cy.get("li").contains("To do");
  cy.get("li").contains("Approve a new subcontractor").click();
  cy.heading("Approve a new subcontractor");
};

export const approveSubcontractorPromptValidation = () => {
  cy.getByLabel("Yes").click();
  cy.button("Save and continue").click();
  [
    "Company name of subcontractor",
    "Company registration number",
    "Is there a relationship between the partner and the subcontractor?",
    "Please describe the relationship between the collaborator and the new subcontractor",
    "Country where the subcontractor's work will be carried out",
    "Brief description of work to be carried out by subcontractor",
    "Justification",
    "Cost of work to be carried out by the new subcontractor",
  ].forEach(list => {
    cy.getListItemFromKey(list, "Edit");
  });
  cy.get("legend").contains("Mark as complete");
  cy.getByLabel("I agree with this change").click();
  cy.button("Save and return to request").click();
  [
    "subcontractor's name.",
    "subcontractor's registration number",
    "country where the subcontractor's work will be carried out.",
    "description of work to be carried out by the subcontractor.",
    "cost of work to be carried out by the new subcontractor.",
    "justification for including the subcontractor.",
  ].forEach(pcrtype => {
    cy.validationLink(`Enter the ${pcrtype}`);
  });
};

export const subcontractorSaveAndReturn = () => {
  cy.button("Save and continue").click();
  cy.button("Save and return to request").click();
  cy.heading("Request");
  cy.get("li").contains("Approve a new subcontractor");
  cy.get("li").contains("Incomplete");
  cy.get("li").contains("Approve a new subcontractor").click();
  cy.heading("Approve a new subcontractor");
  cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
};

export const validateSubcontractorName = () => {
  cy.getByLabel("Company name of subcontractor").invoke("val", contractorName255).trigger("input");
  cy.getByLabel("Company name of subcontractor").type("{moveToEnd}").type("i");
  cy.wait(500);
  cy.button("Save and continue").click();
  cy.validationLink("Subcontractor's name must be 255 characters or less.");
  cy.getByLabel("Company name of subcontractor").type("{moveToEnd}{backspace}");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Company name of subcontractor", contractorName255);
  cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
};

export const validateRegistrationNumber = () => {
  cy.getByLabel("Company registration number");
  cy.reload();
  cy.getByLabel("Company registration number").clear().type("123456789123456789012");
  cy.button("Save and continue").click();
  cy.validationLink("Subcontractor's registration number must be 20 characters or less.");
  cy.paragraph("Subcontractor's registration number must be 20 characters or less.");
  cy.getByLabel("Company registration number").clear().type("Reg-1234591234567891");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Company registration number", "Reg-1234591234567891");
  cy.getListItemFromKey("Company registration number", "Edit").click();
};

export const relationshipButtons = () => {
  cy.getByLabel("Is there a relationship between the partner and the subcontractor?");
  cy.getByLabel("Yes");
  cy.getByLabel("No").click();
};

export const relationshipBoxInput = () => {
  cy.get(".govuk-radios__conditional--hidden");
  cy.getByLabel("Yes").click();
  cy.get(".govuk-radios__conditional");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor");
};

export const validateRelationshipBox = () => {
  cy.paragraph("You have 16000 characters remaining");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor")
    .invoke("val", loremIpsum16k)
    .trigger("input");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor")
    .type("{moveToEnd}")
    .type("t");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor").type(
    "{moveToEnd}{backspace}",
  );
  cy.paragraph("You have 0 characters remaining");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor")
    .type("{moveToEnd}")
    .type("l");
  cy.paragraph("You have 1 character too many");
  cy.button("Save and continue").click();
  cy.validationLink("Relationship between the partner and the subcontractor must be 16000 characters or less.");
  cy.paragraph("Relationship between the partner and the subcontractor must be 16000 characters or less.");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor").type(
    "{moveToEnd}{backspace}",
  );
};

export const saveRelationshipBox = () => {
  cy.button("Save and continue").click();
  cy.getListItemFromKey(
    "Please describe the relationship between the collaborator and the new subcontractor",
    "Pippin's",
  );
};

export const displaySavedRelationship = () => {
  cy.getListItemFromKey(
    "Please describe the relationship between the collaborator and the new subcontractor",
    "Edit",
  ).click();
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor").should(
    "have.value",
    loremIpsum16k,
  );
};

export const clickNoSaveContinue = () => {
  cy.getByLabel("No").click();
  cy.get(".govuk-radios__conditional--hidden");
  cy.button("Save and continue").click();
  cy.get("dt").should(
    "not.have.text",
    "Please describe the relationship between the collaborator and the new subcontractor",
  );
  cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
};

export const clickYesNoContents = () => {
  cy.getByLabel("Yes").click();
  cy.get(".govuk-radios__conditional");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor").should(
    "have.value",
    "",
  );
};

export const populateRelationshipSave = () => {
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor")
    .invoke("val", contractorName255)
    .trigger("input");
  cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor")
    .type("{moveToEnd}")
    .type("t");
  cy.button("Save and continue").click();
  cy.getListItemFromKey(
    "Please describe the relationship between the collaborator and the new subcontractor",
    "Pippin's",
  );
  cy.getListItemFromKey(
    "Please describe the relationship between the collaborator and the new subcontractor",
    "Edit",
  ).click();
  cy.getByLabel("Company name of subcontractor");
};

export const validateCountry = () => {
  cy.getByLabel("Country where the subcontractor's work will be carried out")
    .invoke("val", loremIpsum100Char)
    .trigger("input");
  cy.getByLabel("Country where the subcontractor's work will be carried out").type("{moveToEnd}").type("l");
  cy.button("Save and continue").click();
  cy.validationLink("Country where the subcontactor's work will be carried out must be 100 characters or less.");
  cy.paragraph("Country where the subcontactor's work will be carried out must be 100 characters or less.");
  cy.getByLabel("Country where the subcontractor's work will be carried out").type("{moveToEnd}{backspace}");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Country where the subcontractor's work will be carried out", loremIpsum100Char);
  cy.getListItemFromKey("Country where the subcontractor's work will be carried out", "Edit").click();
};

export const briefDescriptionInput = () => {
  cy.getByLabel("Brief description of work to be carried out by subcontractor")
    .clear()
    .invoke("val", contractorName255)
    .trigger("input");
  cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}").type("t");
  cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}{backspace}");
};

export const increaseBriefDescription = () => {
  cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}").type("t");
  cy.get(".character-count");
  cy.paragraph("You have 1 character too many");
  cy.button("Save and continue").click();
  cy.validationLink("Description of work to be carried out by the subcontractor must be 255 characters or less");
  cy.paragraph("Description of work to be carried out by the subcontractor must be 255 characters or less");
};

export const decreaseBriefDescription = () => {
  cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}{backspace}");
  cy.paragraph("You have 0 characters remaining");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Brief description of work to be carried out by subcontractor", contractorName255);
  cy.getListItemFromKey("Brief description of work to be carried out by subcontractor", "Edit").click();
};

export const briefDescriptionSaved = () => {
  cy.getByLabel("Brief description of work to be carried out by subcontractor").should("have.value", contractorName255);
};

export const validateNumericCurrency = () => {
  cy.get(".govuk-input__prefix").should("have.text", "£");
  ["Lorem ipsum", "$^*", "*()", "/``/q", "99.999"].forEach(input => {
    cy.getByLabel("Cost of work to be carried out by the new subcontractor").clear().type(input);
    cy.button("Save and continue").click();
    cy.validationLink("Enter a valid cost of work.");
    cy.paragraph("Enter a valid cost of work.");
    cy.getByLabel("Cost of work to be carried out by the new subcontractor").clear();
  });
};

export const currencyLengthValidation = () => {
  cy.getByLabel("Cost of work to be carried out by the new subcontractor").type("9999999999999");
  cy.button("Save and continue").click();
  cy.validationLink("Enter a real subcontractor cost.");
  cy.paragraph("Enter a real subcontractor cost.");
  cy.getByLabel("Cost of work to be carried out by the new subcontractor").type("{moveToEnd}{backspace}");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Cost of work to be carried out by the new subcontractor", "£999,999,999,999.00");
  cy.getListItemFromKey("Cost of work to be carried out by the new subcontractor", "Edit").click();
};

export const validateJustificationInput = () => {
  cy.getByLabel("Justification").invoke("val", loremIpsum32k).trigger("input");
  cy.getByLabel("Justification").type("{moveToEnd}").type("1");
  cy.paragraph("You have 1 character too many");
  cy.button("Save and continue").click();
  cy.validationLink("Justification for including the subcontractor must be 32000 characters or less");
  cy.paragraph("Justification for including the subcontractor must be 32000 characters or less");
};

export const reduceJustificationSave = () => {
  cy.getByLabel("Justification").type("{moveToEnd}{backspace}");
  cy.paragraph("You have 0 characters remaining");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Justification", "Pippin's");
};

export const displayCompletedRequest = () => {
  [
    ["Company name of subcontractor", "Pippin's"],
    ["Company registration number", "Reg"],
    ["Is there a relationship between the partner and the subcontractor?", "Yes"],
    ["Please describe the relationship between the collaborator and the new subcontractor", contractorName255],
    ["Country where the subcontractor's work will be carried out", "Swindon"],
    ["Brief description of work to be carried out by subcontractor", contractorName255],
    ["Justification", "Swindon"],
    ["Cost of work to be carried out by the new subcontractor", "£999,999,999,999.00"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const workingEditButtons = () => {
  [
    "Company name of subcontractor",
    "Company registration number",
    "Is there a relationship between the partner and the subcontractor?",
    "Please describe the relationship between the collaborator and the new subcontractor",
    "Country where the subcontractor's work will be carried out",
    "Brief description of work to be carried out by subcontractor",
    "Justification",
    "Cost of work to be carried out by the new subcontractor",
  ].forEach(listItem => {
    cy.getListItemFromKey(listItem, "Edit").click();
    cy.getByLabel("Company name of subcontractor");
    cy.button("Save and continue").click();
  });
};

export const changeStateToIncomplete = () => {
  cy.get("li").contains("Approve a new subcontractor").click();
  cy.heading("Approve a new subcontractor");
  cy.getByLabel("I agree with this change").click();
  cy.button("Save and return to request").click();
  cy.get("li").contains("Incomplete");
};
