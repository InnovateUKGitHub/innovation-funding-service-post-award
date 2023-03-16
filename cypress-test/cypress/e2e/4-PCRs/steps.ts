export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";
export const newPubDescription = "I am a new public description. I am 55 characters long.";
export const newPubSummary = "I am a new public summary. I am 51 characters long.";

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowAllAccordion = () => {
  cy.get("span.govuk-accordion__show-all-text").contains("Show all sections").click();
};

export const createRequestButton = () => {
  cy.get("a.govuk-link.govuk-button").click();
};

export const explainPCRTypes = () => {
  [
    "Reallocate project costs",
    "Remove a partner",
    "Add a partner",
    "Change project scope",
    "Change project duration",
    "Change partner's name",
    "Put a project on hold",
  ].forEach(pcrType => {
    cy.getByQA("form-guidance-list").contains(pcrType);
  });
};

export const pcrCheckBoxes = () => {
  /**
   * Check each check box can be selected
   */
  cy.clickCheckBox("Reallocate project costs");
  cy.clickCheckBox("Remove a partner");
  cy.clickCheckBox("Add a partner");
  cy.clickCheckBox("Change project scope");
  cy.clickCheckBox("Change project duration");
  cy.clickCheckBox("Change a partner's name");
  cy.clickCheckBox("Put project on hold");
  /**
   * Check that each check box can be unselected
   */
  cy.clickCheckBox("Reallocate project costs", true);
  cy.clickCheckBox("Remove a partner", true);
  cy.clickCheckBox("Add a partner", true);
  cy.clickCheckBox("Change project scope", true);
  cy.clickCheckBox("Change project duration", true);
  cy.clickCheckBox("Change a partner's name", true);
  cy.clickCheckBox("Put project on hold", true);
};

export const beforeYouSubmit = () => {
  cy.get("p.govuk-body").contains("Before you submit");
  cy.get("li").contains("ensure");
  cy.get("li").contains("discuss");
};

export const pcrCommentBox = () => {
  cy.get("h2").contains("Add comments");
  cy.get("textarea#comments.govuk-textarea").type(standardComments);
};

export const characterCount = () => {
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 926 characters remaining");
};

//export const deletePcr = () => {
//  visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
//  cy.getByQA("pcrDeleteLink").contains("Delete").click();
//  cy.getByQA("button_delete-qa").click({ force: true });
//};
//
//export const ktpDeletePcr = () => {
//  visitApp({ path: "projects/a0E2600000kTfqTEAS/pcrs/dashboard" });
//  cy.getByQA("pcrDeleteLink").contains("Delete").click();
//  cy.getByQA("button_delete-qa").click({ force: true });
//};

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  cy.get("p").contains("You can upload");
  cy.get("p").contains("There is no limit");
};

export const pcrDocUpload = () => {
  cy.get("input#attachment").selectFile("cypress/common/testfile.doc");
  cy.uploadButton("Upload documents").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
};

export const addPartnerDocUpload = () => {
  cy.get("input#attachment").selectFile("cypress/common/testfile.doc");
  cy.uploadButton("Upload").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
};

export const pcrFileTable = () => {
  cy.tableHeader("File name");
  cy.tableHeader("Type");
  cy.tableHeader("Date uploaded");
  cy.tableHeader("Uploaded by");
};

export const learnOrganisations = () => {
  cy.get("span").contains("What are the different types?").click();
  cy.get("p").contains("Business");
  cy.get("p").contains("Research");
  cy.get("p").contains("Research and technology organisation (RTO)");
  cy.get("p").contains("Public sector, charity or non Je-S");
};

export const completeNewPartnerInfoAsBus = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoAsResearch = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Research").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoAsRto = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Research and Technology Organisation (RTO)").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoAsPublic = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Public Sector, charity or non Je-S registered research organisation").click();
  cy.submitButton("Save and continue").click();
};

export const completeNewPartnerInfoNonAid = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("No").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
};

export const clickCreateRequestButtonProceed = () => {
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.get("h1").should("contain.text", "Request");
};

export const requestHeadingDetailsHeading = () => {
  cy.get("h1").contains("Request");
  cy.get("h2").contains("Details");
};

export const correctPcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Add a partner");
};

export const changeNamePcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Change a partner's name");
};

export const giveUsInfoTodo = () => {
  cy.get("h2").contains("Give us information");
  cy.assertPcrCompletionStatus("Add a partner", "To do");
};

export const explainChangesReasoning = () => {
  cy.get("h2.app-task-list__section").contains("Explain why you want to make the changes");
  cy.get("span.app-task-list__task-name").contains("Provide reasoning to Innovate UK");
  cy.get("strong.govuk-tag.govuk-tag--blue").contains("To do");
};

export const projectOutputs = () => {
  cy.get("h2").contains("Project outputs");
  cy.getByQA("field-isCommercialWork").contains(
    "Will the new partner's work on the project be mostly commercial or economic",
  );
  cy.getByLabel("Yes").click();
  cy.getByLabel("No").click();
  cy.getByLabel("Yes").click();
};

export const organisationRadios = () => {
  cy.getByLabel("Business").click();
  cy.getByLabel("Research").click();
  cy.getByLabel("Research and Technology Organisation (RTO)").click();
  cy.getByLabel("Public Sector, charity or non Je-S").click();
};

export const saveContinueSaveSummary = () => {
  cy.submitButton("Save and continue");
  cy.submitButton("Save and return to summary");
};

export const stateAidAddPartnerHeading = () => {
  cy.get("h1").contains("Add a partner");
  cy.get("h2").contains("State aid eligibility");
};

export const nonAidAddPartnerHeading = () => {
  cy.get("h1").contains("Add a partner");
  cy.get("h2").contains("Non-aid funding");
};

export const stateAidFurtherInfo = () => {
  cy.get("p").contains("This competition provides funding that is classed as non-aid");
  cy.get("p").contains("Non-aid is only granted to organisations which declare");
  cy.get("p").contains("in any way which gives them");
  cy.get("p").contains("in any other way which would");
};

export const addPartnerCompanyHouseHeader = () => {
  cy.get("h1").contains("Add a partner");
  cy.get("h2").contains("Company house");
};

export const searchCompanyHouseGuidance = () => {
  cy.get("h2").contains("Search companies house");
  cy.get("p").contains("Is your organisation not showing in these results?");
};

export const typeASearchResults = () => {
  cy.get("#searchCompaniesHouse").type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.get(`input[type="radio"]`).click();
};

export const companyHouseAutofillAssert = () => {
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
};

export const projectRoleRadios = () => {
  cy.get("h2").contains("Project role");
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Project Lead").click();
};

export const reallocateCostsTableHeaders = () => {
  [
    "Partner",
    "Total eligible costs",
    "Remaining costs",
    "Remaining grant",
    "New total eligible costs",
    "New remaining costs",
    "New remaining grant",
  ].forEach(costHeader => {
    cy.tableHeader(costHeader);
  });
};

export const reallocateCostsPcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Reallocate project costs");
};

export const reallocateCostsGiveInfoTodo = () => {
  cy.get("span.app-task-list__task-name").contains("Reallocate project costs");
  cy.get("h2.app-task-list__section").contains("Give us information");
  cy.get("strong.govuk-tag.govuk-tag--blue").contains("To do");
};

export const showPartners = () => {
  cy.contains("EUI Small Ent Health");
  cy.contains("A B Cad Services");
  cy.contains("ABS EUI Medium Enterprise");
};

export const markAsComplete = () => {
  cy.get("h2").contains("Mark as complete");
  cy.get("input#itemStatus_true.govuk-checkboxes__input").click();
};

export const reallocateCostsGiveUsInfoContinue = () => {
  cy.get("h2.app-task-list__section").contains("Give us information");
  cy.get("span.app-task-list__task-name").contains("Reallocate project costs").click();
};

export const reallocateCostsAndPartner = () => {
  cy.get("h1").contains("Reallocate costs");
  cy.get("h2").contains("EUI Small Ent Health");
};

export const reallocateCostsCats = () => {
  [
    "Labour",
    "Overheads",
    "Materials",
    "Capital usage",
    "Subcontracting",
    "Travel and subsistence",
    "Other costs",
    "Other costs 2",
    "Other costs 3",
    "Other costs 4",
    "Other costs 5",
    "Partner totals",
  ].forEach(costCat => {
    cy.tableCell(costCat);
  });
};

export const removePartnerPcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Remove a partner");
};

export const removePartnerGiveInfoTodo = () => {
  cy.get("h2").contains("Give us information");
  cy.assertPcrCompletionStatus("Remove a partner", "To do");
};

export const clickPartnerAddPeriod = () => {
  cy.getByLabel("EUI Small Ent Health").click();
  cy.get("#removalPeriod").clear().type("3");
  cy.submitButton("Save and continue").click();
};

export const removePartnerGuidanceInfo = () => {
  cy.get("p").contains("You must upload these documents");
  cy.get("li").contains("a confirmation letter");
  cy.get("li").contains("a brief list of");
  cy.get("li").contains("copies of signed letters");
};

export const removePartnerTable = () => {
  cy.getByQA("partnerToRemove").contains("Partner being removed");
  cy.getByQA("removalPeriod").contains("Last period");
  cy.getByQA("supportingDocuments").contains("Documents");
};

export const navigateToPartnerOrgPage = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.get("h1").should("contain.text", "Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house");
  cy.get("#searchCompaniesHouse").type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
};

export const navigateToFinancialsPage = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.get("h1").should("contain.text", "Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house");
  cy.get(`input[id="searchCompaniesHouse"]`).type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
};

export const navigateToPartnerLocation = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.get("h1").should("contain.text", "Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house");
  cy.get(`input[id="searchCompaniesHouse"]`).type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Financial details");
  cy.get(`input[id="financialYearEndDate_month"]`).type("03");
  cy.get(`input[id="financialYearEndDate_year"]`).type("2022");
  cy.get(`input[id="financialYearEndTurnover"]`).type("1000000");
  cy.submitButton("Save and continue").click();
};

export const navigateToPartnerPerson = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.get("h1").should("contain.text", "Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house");
  cy.get(`input[id="searchCompaniesHouse"]`).type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Financial details");
  cy.get(`input[id="financialYearEndDate_month"]`).type("03");
  cy.get(`input[id="financialYearEndDate_year"]`).type("2022");
  cy.get(`input[id="financialYearEndTurnover"]`).type("1000000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Project location");
  cy.get(`input[id="projectLocation_10"]`).click();
  cy.get(`input[id="projectCity"]`).type("Swindon");
  cy.get(`input[id="projectPostcode"]`).type("SN5");
  cy.submitButton("Save and continue").click();
};

export const navigateToPartnerCosts = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.get("h1").should("contain.text", "Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house");
  cy.get(`input[id="searchCompaniesHouse"]`).type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Financial details");
  cy.get(`input[id="financialYearEndDate_month"]`).type("03");
  cy.get(`input[id="financialYearEndDate_year"]`).type("2022");
  cy.get(`input[id="financialYearEndTurnover"]`).type("1000000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Project location", { timeout: 20000 });
  cy.get(`input[id="projectLocation_10"]`).click();
  cy.get(`input[id="projectCity"]`).type("Swindon");
  cy.get(`input[id="projectPostcode"]`).type("SN5");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Add person to organisation");
  cy.get(`input[id="contact1Forename"]`).type("Joseph");
  cy.get(`input[id="contact1Surname"]`).type("Dredd");
  cy.get(`input[id="contact1Phone"]`).type("01234567890");
  cy.get(`input[id="contact1Email"]`).type("Joseph.dredd@mc1.comtest");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Project costs for new partner");
};

export const pcrNewCostCatLineItem = () => {
  cy.wait(500);
  cy.get("a").contains("Add a cost").click();
  cy.get(`input[id="description"]`).type("Law keeper");
  cy.get("h2").contains("Labour");
  cy.get(`input[id="grossCostOfRole"]`).type("50000");
  cy.get(`input[id="ratePerDay"]`).type("500");
  cy.get(`input[id="daysSpentOnProject"]`).type("100");
  cy.wait(500);
  cy.get("div").contains("Total cost will update when saved.");
  cy.get("span").contains("£50,000.00");
  cy.submitButton("Save and return to labour").click();
};

export const addPartnerSummaryTable = () => {
  cy.get("h2").contains("Organisation");
  cy.get("dt").contains("Project role");
  cy.get("dt").contains("Commercial or economic project outputs?");
  cy.get("dt").contains("Organisation type");
  cy.get("dt").contains("Eligibility of aid declaration").siblings().contains("a", "Edit");
  cy.get("dt").contains("Organisation name").siblings().contains("a", "Edit");
  cy.get("dt").contains("Registration number").siblings().contains("a", "Edit");
  cy.get("dt").contains("Registered address").siblings().contains("a", "Edit");
  cy.get("dt").contains("Size").siblings().contains("a", "Edit");
  cy.get("dt").contains("Number of full time employees").siblings().contains("a", "Edit");
  cy.get("dt").contains("End of financial year").siblings().contains("a", "Edit");
  cy.get("dt").contains("Turnover").siblings().contains("a", "Edit");
  cy.get("dt").contains("Project location").siblings().contains("a", "Edit");
  cy.get("dt").contains("Name of town or city").siblings().contains("a", "Edit");
  cy.get("dt").contains("Postcode, postal code or zip code").siblings().contains("a", "Edit");
  cy.get("h2").contains("Contacts");
  cy.get("h3").contains("Finance contact");
  cy.get("dt").contains("First name").siblings().contains("a", "Edit");
  cy.get("dt").contains("Last name").siblings().contains("a", "Edit");
  cy.get("dt").contains("Phone number").siblings().contains("a", "Edit");
  cy.get("dt").contains("Email").siblings().contains("a", "Edit");
  cy.get("h2").contains("Funding");
  cy.get("dt").contains("Project costs for new partner").siblings().contains("a", "Edit");
  cy.get("dt").contains("Other sources of funding").siblings().contains("a", "Edit");
  cy.get("dt").contains("Funding level").siblings().contains("a", "Edit");
  cy.get("dt").contains("Funding sought");
  cy.get("dt").contains("Partner contribution to project");
  cy.get("h2").contains("Agreement");
  cy.get("dt").contains("Partner agreement").siblings().contains("a", "Edit");
};

export const fieldNameInputs = () => {
  cy.getByQA("field-contact1Forename").contains("First name");
  cy.getByQA("field-contact1Surname").contains("Last name");
  cy.getByQA("field-contact1Phone").contains("Phone number");
  cy.getByQA("field-contact1Phone").contains("We may use this to contact the partner");
  cy.getByQA("field-contact1Email").contains("Email");
  cy.get(`input[id="contact1Forename"]`).type("Joseph");
  cy.get(`input[id="contact1Surname"]`).type("Dredd");
  cy.get(`input[id="contact1Phone"]`).type("01234567890");
  cy.get(`input[id="contact1Email"]`).type("Joseph.dredd@mc1.comtest");
};

export const addPartnerCostCat = () => {
  cy.tableHeader("Category");
  cy.tableHeader("Cost (£)");
  [
    "Labour",
    "Overheads",
    "Materials",
    "Capital usage",
    "Subcontracting",
    "Travel and subsistence",
    "Other costs",
    "Other costs 2",
    "Other costs 3",
    "Other costs 4",
    "Other costs 5",
    "Total costs (£)",
  ].forEach(cat => cy.tableCell(cat));
};

export const ktpAddPartnerCostCat = () => {
  cy.tableHeader("Category");
  cy.tableHeader("Cost (£)");
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
    "Total costs (£)",
  ].forEach(cat => cy.tableCell(cat));
};

export const addPartnerLabourGuidance = () => {
  [
    "gross salary",
    "National Insurance",
    "company pension",
    "life insurance",
    "other non-discretionary package costs",
    "discretionary bonuses",
    "performance related payments",
    "sick days",
    "waiting time",
    "training days",
    "non-productive time",
  ].forEach(labourGuidance => {
    cy.get("li").contains(labourGuidance);
  });
  cy.get("span").contains("Labour guidance").click();
  cy.get("h2").contains("Labour");
  [
    "The new partner will need to account for all labour",
    "You cannot include:",
    "You may include the total number",
    "List the total days worked",
    "We will review the total",
  ].forEach(pGuidance => {
    cy.get("p").contains(pGuidance);
  });
};

export const addPartnerLabourCost = () => {
  cy.wait(5000);
  cy.tableHeader("Description");
  cy.tableHeader("Cost (£)");
  cy.tableHeader("Total labour");
};

export const otherFundingTable = () => {
  cy.tableHeader("Source of funding");
  cy.tableHeader("Date secured (MM YYYY)");
  cy.tableHeader("Funding amount (£)");
  cy.tableCell("Total other funding");
};

export const addSourceOfFunding = () => {
  cy.getByQA("add-fund").contains("Add another source of funding").click();
  cy.get("#item_0_description").type("Public");
  cy.get("#item_0_date_month").type("12");
  cy.get("#item_0_date_year").type("2022");
  cy.get("#item_0_value").type("50000");
  cy.wait(500);
};

export const fundingLevelPage = () => {
  cy.get("h2").contains("Funding level");
  cy.get("p").contains("The maximum the new organisation can enter");
  cy.get("p").contains("The percentage applied for");
};

export const uploadPartnerInfo = () => {
  cy.get("h2").contains("Upload partner agreement");
  cy.get("p").contains("You must upload copies of signed letters");
};

export const fundingLevelPercentage = () => {
  cy.get("h2").contains("Funding level");
  cy.get("#awardRate").type("5");
  cy.submitButton("Save and continue").click();
};

export const addPartnerSize = () => {
  cy.get("h2").contains("Size");
  cy.get("p").contains("This definition must include");
  cy.get("p").contains("Use the European Commission (EC)");
};

export const addPartnerSizeOptions = () => {
  cy.getByLabel("Small").click();
  cy.getByLabel("Medium").click();
  cy.getByLabel("Large").click();
};

export const addPartnerTurnover = () => {
  cy.getByLabel("Month").type("03");
  cy.getByLabel("Year").type("2022");
  cy.get("#financialYearEndTurnover").type("1000000");
};

export const addPartnerLocation = () => {
  cy.get("h2").contains("Name of town or city");
  cy.get("h2").contains("Postcode, postal code or zip code");
  cy.getByQA("field-projectPostcode").contains("If this is not available,");
};

export const otherFundingOptions = () => {
  cy.get("#hasOtherFunding_true").click();
  cy.get("#hasOtherFunding_false").click();
  cy.get("#hasOtherFunding_true").click();
};

export const headingAndGuidance = () => {
  [
    "Your public description is published in line",
    "It should describe your project",
    "Do not include any information that is confidential",
    "Your project summary should provide a clear overview",
  ].forEach(guidance => {
    cy.get("p").contains(guidance);
  }),
    ["your vision for the project", "key objectives", "main areas of focus", "details of how it is innovative"].forEach(
      bullet => {
        cy.get("li").contains(bullet);
      },
    ),
    cy.get("h1").contains("Change project scope");
};

export const proposedDescription = () => {
  cy.get("h2").contains("Proposed public description");
  cy.get("span").contains("Published public description").click();
  cy.get("p").contains("Hello! I am the public description for this Cypress project.");
};

export const newDescriptionEntry = () => {
  cy.get("textarea")
    .contains("Hello! I am the public description for this Cypress project.")
    .clear()
    .type(newPubDescription);
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 31945 characters remaining");
};

export const proposedSummary = () => {
  cy.get("h2").contains("Proposed project summary");
  cy.get("span").contains("Published project summary").click();
  cy.get("p").contains("Howdy! I am the public summary for this Cypress project.");
};

export const newSummaryEntry = () => {
  cy.get("textarea").contains("Howdy! I am the public summary for this Cypress project.").clear().type(newPubSummary);
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 31949 characters remaining");
};

export const scopeSummaryPage = () => {
  [
    "Existing public description",
    "Hello! I am the public description for this Cypress project.",
    "New public description",
    "I am a new public description. I am 55 characters long.",
    "Existing project summary",
    "Howdy! I am the public summary for this Cypress project.",
    "New project summary",
    "I am a new public summary. I am 51 characters long.",
    "Edit",
  ].forEach(summaryItem => {
    cy.getByQA("scope-change-summary").contains(summaryItem);
  });
};

export const correctKtpMessaging = () => {
  [
    "This project does not follow the normal grant calculation rules",
    "The project and any partner may have one or more cost categories",
  ].forEach(validation => {
    cy.getByQA("validation-message-content").contains(validation);
  });
  [
    "The knowledge base partner may vire funds between the 'Travel and subsistence' and 'Consumables' cost categories",
    "Funds can also be vired out of these 2 categories into the 'Associate development' category",
    "Virements are subject to approval by the Local Management Committee (LMC).",
    "Requests for virements must be submitted online using the Innovation Funding Service",
  ].forEach(sentence => {
    cy.get("p").contains(sentence);
  });
};

export const ktpCostsTable = () => {
  [
    "Associate employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
    "Partner totals",
    "Cost category",
    "Total eligible costs",
    "Costs claimed",
    "New total eligible costs",
    "Costs reallocated",
    "Remaining grant",
    "Award rate",
    "New remaining grant",
  ].forEach(virements => {
    cy.getByQA("partnerVirements").contains(virements);
  });
  [
    "Total eligible costs",
    "New total eligible costs",
    "Difference",
    "Total remaining grant",
    "New total remaining grant",
  ].forEach(summary => {
    cy.getByQA("summary-table").contains(summary);
  });
  cy.get("h2").contains("Summary of project costs");
};

export const ktpUpdateVirement = () => {
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
  ].forEach(input => {
    cy.getByAriaLabel(input).clear().type("100");
  });
  cy.get("td:nth-child(4)").contains("£1,000.00");
  [
    "Associate Employment",
    "Travel and subsistence",
    "Consumables",
    "Associate development",
    "Knowledge base supervisor",
    "Estate",
    "Indirect costs",
    "Other costs",
    "Additional associate support",
    "Subcontracting",
  ].forEach(input => {
    cy.getByAriaLabel(input).clear().type("0");
  });
  cy.wait(500);
};

export const saveAndReturn = () => {
  cy.get("#grantMovingOverFinancialYear").type("0");
  cy.clickCheckBox("I agree with this change");
  cy.wait(500);
  cy.getByQA("button_default-qa").contains("Save and return to request").click({ force: true });
  cy.get("h1").contains("Request");
};

export const correctHeadings = () => {
  cy.get("h1").contains("Change a partner's name");
  cy.backLink("Back to request");
  shouldShowProjectTitle;
};

export const tickEachPartner = () => {
  cy.get("p").contains("This will change the partner's name in all projects");
  cy.get("h2").contains("Select partner");
  cy.getByLabel("EUI Small Ent Health").click();
  cy.getByLabel("A B Cad Services").wait(500).click();
  cy.getByLabel("ABS EUI Medium Enterprise").wait(500).click({ force: true });
};

export const saveContinueProceed = () => {
  cy.getByQA("button_default-qa").contains("Save and continue").click();
  cy.get("h2").contains("Upload change of name certificate");
  shouldShowProjectTitle;
  cy.get("h1").contains("Change a partner's name");
};

export const uploadNameChange = () => {
  cy.get("input#attachment.govuk-file-upload").selectFile("cypress/common/testfile.doc");
  cy.submitButton("Upload").click();
  cy.getByQA("validation-message-content").contains("Your document has been uploaded.");
};

export const showUploadedFiles = () => {
  cy.get("h2").contains("Files uploaded");
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach(header => {
    cy.tableHeader(header);
  });
  ["testfile.doc", "Unknown", "0KB", "James Black", "Remove"].forEach(cell => {
    cy.tableCell(cell);
  });
};

export const summaryOfChanges = () => {
  [
    "Existing name",
    "Proposed name",
    "Change of name certificate",
    "ABS EUI Medium Enterprise",
    "	Cyberdyne systems",
    "testfile.doc",
    "Edit",
  ].forEach(item => {
    cy.getByQA("name-change-summary-list").contains(item);
  });
};

export const assertChangeNamePage = () => {
  cy.get("h1").contains("Change a partner's name");
  cy.backLink("Back to request");
  shouldShowProjectTitle;
};

export const completeChangeName = () => {
  cy.get("h2").contains("Mark as complete");
  cy.getByLabel("I agree with this change").click();
  cy.getByQA("button_default-qa").contains("Save and return to request").click();
  cy.get("strong").contains("Complete");
};
