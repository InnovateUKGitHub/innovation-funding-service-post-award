import { visitApp } from "../../common/visit";

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";

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
  cy.getByQA("form-guidance-list").contains("Reallocate project costs");
  cy.getByQA("form-guidance-list").contains("Remove a partner");
  cy.getByQA("form-guidance-list").contains("Add a partner");
  cy.getByQA("form-guidance-list").contains("Change project scope");
  cy.getByQA("form-guidance-list").contains("Change project duration");
  cy.getByQA("form-guidance-list").contains("Change partner's name");
  cy.getByQA("form-guidance-list").contains("Put a project on hold");
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

export const deletePcr = () => {
  visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
  cy.getByQA("pcrDeleteLink").contains("Delete", { timeout: 10000 }).click();
  cy.getByQA("button_delete-qa").click({ force: true });
};

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  cy.get("p").contains("You can upload");
  cy.get("p").contains("There is no limit");
};

export const pcrDocUpload = () => {
  cy.get("input#attachment", { timeout: 10000 }).selectFile("cypress/common/testfile.doc", { timeout: 5000 });
  cy.uploadButton("Upload documents").click();
};

export const addPartnerDocUpload = () => {
  cy.get("input#attachment", { timeout: 10000 }).selectFile("cypress/common/testfile.doc", { timeout: 5000 });
  cy.uploadButton("Upload").click();
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
  cy.get("h1").contains("Add a partner", { timeout: 10000 });
  cy.get("h2").contains("State aid eligibility", { timeout: 10000 });
};

export const stateAidFurtherInfo = () => {
  cy.get("p").contains("This competition provides funding that is classed as non-aid");
  cy.get("p").contains("Non-aid is only granted to organisations which declare");
  cy.get("p").contains("in any way which gives them");
  cy.get("p").contains("in any other way which would");
};

export const addPartnerCompanyHouseHeader = () => {
  cy.get("h1").contains("Add a partner", { timeout: 10000 });
  cy.get("h2").contains("Company house", { timeout: 10000 });
};

export const searchCompanyHouseGuidance = () => {
  cy.get("h2").contains("Search companies house");
  cy.get("p").contains("Is your organisation not showing in these results?");
};

export const typeASearchResults = () => {
  cy.get(`input[id="searchCompaniesHouse"]`, { timeout: 10000 }).type("A").wait(500);
  cy.get("h2").contains("Companies house search results", { timeout: 5000 });
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
  cy.tableHeader("Partner");
  cy.tableHeader("Total eligible costs");
  cy.tableHeader("Remaining costs");
  cy.tableHeader("Remaining grant");
  cy.tableHeader("New total eligible costs");
  cy.tableHeader("New remaining costs");
  cy.tableHeader("New remaining grant");
};

export const reallocateCostsPcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Reallocate project costs");
};

export const reallocateCostsGiveInfoTodo = () => {
  cy.get("h2.app-task-list__section").contains("Give us information");
  cy.get("span.app-task-list__task-name").contains("Reallocate project costs");
  cy.get("strong.govuk-tag.govuk-tag--blue").contains("To do");
};

export const showPartners = () => {
  cy.tableCell("EUI Small Ent Health");
  cy.tableCell("A B Cad Services");
  cy.tableCell("ABS EUI Medium Enterprise");
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
  cy.tableCell("Labour");
  cy.tableCell("Overheads");
  cy.tableCell("Materials");
  cy.tableCell("Capital usage");
  cy.tableCell("Subcontracting");
  cy.tableCell("Travel and subsistence");
  cy.tableCell("Other costs");
  cy.tableCell("Other costs 2");
  cy.tableCell("Other costs 3");
  cy.tableCell("Other costs 4");
  cy.tableCell("Other costs 5");
  cy.tableCell("Partner totals");
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
  cy.get(`input[id="removalPeriod"]`).clear().type("3");
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
  cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility", { timeout: 10000 });
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house", { timeout: 10000 });
  cy.get(`input[id="searchCompaniesHouse"]`, { timeout: 10000 }).type("A").wait(500);
  cy.get("h2").contains("Companies house search results", { timeout: 5000 });
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`, { timeout: 10000 });
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
  cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility", { timeout: 10000 });
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house", { timeout: 10000 });
  cy.get(`input[id="searchCompaniesHouse"]`, { timeout: 10000 }).type("A").wait(500);
  cy.get("h2").contains("Companies house search results", { timeout: 5000 });
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`, { timeout: 10000 });
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details", { timeout: 10000 });
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
  cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility", { timeout: 10000 });
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house", { timeout: 10000 });
  cy.get(`input[id="searchCompaniesHouse"]`, { timeout: 10000 }).type("A").wait(500);
  cy.get("h2").contains("Companies house search results", { timeout: 5000 });
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`, { timeout: 10000 });
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details", { timeout: 10000 });
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Financial details", { timeout: 10000 });
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
  cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility", { timeout: 10000 });
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house", { timeout: 10000 });
  cy.get(`input[id="searchCompaniesHouse"]`, { timeout: 10000 }).type("A").wait(500);
  cy.get("h2").contains("Companies house search results", { timeout: 5000 });
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`, { timeout: 10000 });
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details", { timeout: 10000 });
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Financial details", { timeout: 10000 });
  cy.get(`input[id="financialYearEndDate_month"]`).type("03");
  cy.get(`input[id="financialYearEndDate_year"]`).type("2022");
  cy.get(`input[id="financialYearEndTurnover"]`).type("1000000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Project location", { timeout: 20000 });
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
  cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("State aid eligibility", { timeout: 20000 });
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Search companies house", { timeout: 10000 });
  cy.get(`input[id="searchCompaniesHouse"]`, { timeout: 10000 }).type("A").wait(500);
  cy.get("h2").contains("Companies house search results", { timeout: 5000 });
  cy.get(`input[type="radio"]`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`, { timeout: 10000 });
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Organisation details", { timeout: 10000 });
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Financial details", { timeout: 10000 });
  cy.get(`input[id="financialYearEndDate_month"]`).type("03");
  cy.get(`input[id="financialYearEndDate_year"]`).type("2022");
  cy.get(`input[id="financialYearEndTurnover"]`).type("1000000");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Project location", { timeout: 20000 });
  cy.get(`input[id="projectLocation_10"]`).click();
  cy.get(`input[id="projectCity"]`).type("Swindon");
  cy.get(`input[id="projectPostcode"]`).type("SN5");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Add person to organisation", { timeout: 15000 });
  cy.get(`input[id="contact1Forename"]`).type("Joseph");
  cy.get(`input[id="contact1Surname"]`).type("Dredd");
  cy.get(`input[id="contact1Phone"]`).type("01234567890");
  cy.get(`input[id="contact1Email"]`).type("Joseph.dredd@mc1.comtest");
  cy.submitButton("Save and continue").click();
  cy.get("h2").contains("Project costs for new partner", { timeout: 10000 });
};

export const pcrNewCostCatLineItem = () => {
  cy.wait(500);
  cy.get("a").contains("Add a cost", { timeout: 10000 }).click();
  cy.get(`input[id="description"]`, { timeout: 10000 }).type("Law keeper");
  cy.get("h2").contains("Labour");
  cy.get(`input[id="grossCostOfRole"]`).type("50000");
  cy.get(`input[id="ratePerDay"]`).type("500");
  cy.get(`input[id="daysSpentOnProject"]`).type("100");
  cy.wait(500);
  cy.get("div").contains("Total cost will update when saved.");
  cy.get("span").contains("£50,000.00");
  cy.submitButton("Save and return to labour").click();
};
