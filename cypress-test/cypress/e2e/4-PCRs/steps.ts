import { PcrType } from "typings/pcr";
import { documents } from "e2e/2-claims/steps";
import { seconds } from "common/seconds";
import { testFile } from "common/testfileNames";

let date = new Date();
let createdDay = date.getDate();
let comments = JSON.stringify(date);

const moEmail = "testman2@testing.com";
const pmEmail = "james.black@euimeabs.test";

const partnersList = [
  "EUI Small Ent Health",
  "A B Cad Services",
  "ABS EUI Medium Enterprise",
  "Auto Corporation Ltd",
  "Auto Healthcare Ltd",
  "Auto Monitoring Ltd",
  "Auto Research Ltd",
  "Brown and co",
  "Deep Rock Galactic",
  "EUI Micro Research Co.",
  "Gorcium Management Services Ltd.",
  "Hyperion Corporation",
  "Image Development Society",
  "Intaser",
  "Jakobs",
  "Java Coffee Inc",
  "Lutor Systems",
  "Maliwan",
  "Munce Inc",
  "National Investment Bank",
  "NIB Reasearch Limited",
  "RBA Test Account 1",
  "Red Motor Research Ltd.",
  "Swindon Development University",
  "Swindon University",
  "The Best Manufacturing",
  "Top Castle Co.",
  "UAT37",
  "University of Bristol",
  "Vitruvius Stonework Limited",
  "YHDHDL",
  "Hedges' Hedges Ltd",
];

export const standardComments = "This is a standard message for use in a text box. I am 74 characters long.";
export const newPubDescription = "I am a new public description. I am 55 characters long.";
export const newPubSummary = "I am a new public summary. I am 51 characters long.";

export const shouldShowProjectTitle = () => {
  cy.getByQA("page-title-caption").should("contain.text", "CYPRESS");
};

export const shouldShowPastRequestsAccordion = () => {
  cy.get("span").should("not.have.text", "Show all sections");
  cy.get("span").contains("Show");
  cy.button("Past requests").click();
  cy.get("span").contains("Hide");
};

export const statusAndCommentsAccordion = () => {
  cy.get("span").should("not.have.text", "Show all sections");
  cy.get("span").contains("Show");
  cy.button("Status and comments log").click();
  cy.get("span").contains("Hide");
};

export const createRequestButton = () => {
  cy.get("a.govuk-link.govuk-button").click();
};

export const pcrCheckboxesWithHint = () => {
  [
    "Reallocate project costs",
    "Remove a partner",
    "Add a partner",
    "Change project scope",
    "Change project duration",
    "Change a partner's name",
    "Put project on hold",
  ].forEach(pcrType => {
    cy.get(".govuk-label").contains(pcrType);
    cy.get(".govuk-label").contains(pcrType).get(".govuk-hint");
  });
};

export const pcrCheckBoxes = () => {
  /**
   * Check each check box can be selected
   */
  cy.clickCheckBox<PcrType>("Reallocate project costs");
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Remove a partner");
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Add a partner");
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Change project scope");
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Change project duration");
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Change a partner's name");
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Put project on hold");
  cy.wait(500);
  /**
   * Check that each check box can be unselected
   */
  cy.clickCheckBox<PcrType>("Reallocate project costs", true);
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Remove a partner", true);
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Add a partner", true);
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Change project scope", true);
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Change project duration", true);
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Change a partner's name", true);
  cy.wait(500);
  cy.clickCheckBox<PcrType>("Put project on hold", true);
  cy.wait(500);
};

export const beforeYouSubmit = () => {
  cy.get("span.govuk-body").contains("Before you submit");
  cy.list("ensure");
  cy.list("discuss");
};

export const pcrCommentBox = () => {
  cy.get("legend").contains("Add comments");
  cy.getByQA("hint-info-text-area").contains(
    "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.",
  );
  cy.get("textarea#comments.govuk-textarea").type(standardComments);
};

export const characterCount = () => {
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 926 characters remaining");
};

export const learnFiles = () => {
  cy.get("span").contains("Learn more about files you can upload").click();
  cy.paragraph("You can upload");
  cy.paragraph("There is no limit");
};

export const pcrDocUpload = () => {
  cy.fileInput("testfile.doc");
  cy.uploadButton("Upload documents").click();
  cy.validationNotification("Your document has been uploaded.");
};

export const addPartnerDocUpload = () => {
  cy.fileInput("testfile.doc");
  cy.uploadButton("Upload").click();
  cy.validationNotification("Your document has been uploaded.");
};

const uploadedDocs = documents.reverse();

export const removePartnerFileTable = () => {
  uploadedDocs.forEach(doc => {
    cy.get("td:nth-child(1)").contains(doc);
  });
};

export const pcrFileTable = (fileName: string, uploadedBy: string) => {
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach((header, index) => {
    cy.get(`th:nth-child(${index + 1})`).contains(header);
  });
  ["testfile.doc", fileName, "2023", "0KB", uploadedBy].forEach((rowItem, index) => {
    cy.get(`td:nth-child(${index + 1})`).contains(rowItem);
  });
};

export const learnOrganisations = () => {
  cy.get("span").contains("What are the different types?").click();
  ["Business", "Research", "Research and technology organisation (RTO)", "Public sector, charity or non Je-S"].forEach(
    organisation => {
      cy.paragraph(organisation);
    },
  );
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

export const requestHeadingDetailsHeading = () => {
  cy.heading("Request");
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

export const changeDurationPcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Change project duration");
};

export const projectOnHoldPcrType = () => {
  cy.get("dt.govuk-summary-list__key").contains("Types");
  cy.get("dd.govuk-summary-list__value").contains("Put project on hold");
};

export const giveUsInfoTodo = () => {
  cy.get("h2").contains("Give us information");
  cy.assertPcrCompletionStatus("Add a partner", "To do");
};

export const explainChangesReasoning = () => {
  cy.get("h2.app-task-list__section").contains("Explain why you want to make the changes");
  cy.get("span.app-task-list__task-name").contains("Provide reasons to Innovate UK");
  cy.get("strong.govuk-tag.govuk-tag--grey").contains("To do");
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
  cy.heading("Add a partner");
  cy.get("h2").contains("State aid eligibility");
};

export const nonAidAddPartnerHeading = () => {
  cy.heading("Add a partner");
  cy.get("h2").contains("Non-aid funding");
};

export const stateAidFurtherInfo = () => {
  [
    "This competition provides funding that is classed as non-aid",
    "Non-aid is only granted to organisations which declare",
    "in any way which gives them",
    "in any other way which would",
  ].forEach(furtherInfo => {
    cy.paragraph(furtherInfo);
  });
};

export const addPartnerCompanyHouseHeader = () => {
  cy.heading("Add a partner");
  cy.get("h2").contains("Company house");
};

export const searchCompanyHouseGuidance = () => {
  cy.get("h2").contains("Search companies house");
  cy.paragraph("Is your organisation not showing in these results?");
};

export const specialCharInput = () => {
  ["&", "!", "£", "$", "%", "^", "*", "(", ")", "-", "+", "=", "////", "|"].forEach(specChar => {
    cy.get("#searchCompaniesHouse").clear().type(specChar).wait(3000);
    cy.getByQA("error-summary").should("not.exist");
  });
};

export const typeASearchResults = () => {
  cy.get("#searchCompaniesHouse").clear().type("A").wait(500);
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
  cy.get("strong.govuk-tag.govuk-tag--grey").contains("To do");
};

export const showPartners = () => {
  ["EUI Small Ent Health", "A B Cad Services", "ABS EUI Medium Enterprise"].forEach((partner, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(1)`).contains(partner);
      });
  });
};

export const partnerRadioButtons = () => {
  ["EUI Small Ent Health", "A B Cad Services", "ABS EUI Medium Enterprise"].forEach(partner => {
    cy.getByLabel(partner);
  });
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
  cy.heading("Reallocate costs");
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

export const removePartnerContinueNoEdit = () => {
  cy.button("Save and continue").click();
  cy.get("legend").contains("Upload withdrawal of partner certificate");
  cy.button("Save and continue").click();
  cy.get("legend").contains("Mark as complete");
};

export const removePartnerPromptValidation = () => {
  cy.getByLabel("I agree with this change").click();
  cy.wait(500);
  cy.button("Save and return to request").click();
  cy.validationLink("Enter a valid removal period");
  cy.validationLink("Select a partner to remove from this project.");
};

export const validatePeriodBox = () => {
  cy.getByAriaLabel("Removal period").clear().type("13");
  cy.wait(1000);
  cy.button("Save and continue").click();
  cy.validationLink("Period must be 12 or fewer");
  cy.paragraph("Period must be 12 or fewer");
  cy.getByAriaLabel("Removal period").clear().type("not a number");
  cy.wait(1000);
  cy.button("Save and continue").click();
  cy.validationLink("Period must be a whole number, like 3.");
  cy.paragraph("Period must be a whole number, like 3.");
  ["!", "$", "%", "^", "&", "*", "<", ">"].forEach(specialChar => {
    cy.getByAriaLabel("Removal period").clear().type(specialChar);
    cy.wait(1000);
    cy.button("Save and continue").click();
    cy.validationLink("Period must be a whole number, like 3.");
  });
  ["-1", "-100", "-3333333", "-0"].forEach(negative => {
    cy.getByAriaLabel("Removal period").clear().type(negative);
    cy.wait(1000);
    cy.button("Save and continue").click();
    cy.validationLink("Enter a valid removal period");
    cy.paragraph("Enter a valid removal period");
  });
};

export const clickPartnerAddPeriod = () => {
  cy.getByLabel("EUI Small Ent Health").click();
  cy.get("#removalPeriod").clear().type("3");
  cy.submitButton("Save and continue").click();
  cy.get("legend").contains("Upload withdrawal of partner certificate");
};

export const removePartnerGuidanceInfo = () => {
  cy.paragraph("You must upload these documents");
  cy.list(
    "a confirmation letter on headed paper from the partner who is leaving, signed by someone with financial authority",
  );
  cy.list("a brief list of the outstanding deliverables, and who each will be assigned to once the partner leaves");
  cy.list("copies of signed letters");
};

export const removePartnerTable = () => {
  [
    ["Partner being removed", "EUI Small Ent Health"],
    ["Last period", "3"],
    ["Documents", "testfile.doc"],
  ].forEach(([key, listItem]) => {
    cy.getListItemFromKey(key, listItem);
  });
};

export const removePartnerEditLinks = () => {
  [
    ["Partner being removed", "Select partner to remove"],
    ["Last period", "When is their last period?"],
    ["Documents", "Upload withdrawal of partner certificate"],
  ].forEach(([key, subheading]) => {
    cy.getListItemFromKey(key, "Edit").click();
    cy.get("legend").contains(subheading);
    cy.backLink("Back to request").click();
    cy.get("a").contains("Remove a partner").click();
    cy.get("legend").contains("Mark as complete");
  });
};

export const removePartnerMarkAsComplete = () => {
  cy.get("legend").contains("Mark as complete");
  cy.clickCheckBox("I agree with this change");
  cy.getByLabel("I agree with this change.").should("be.checked");
};

export const removePartnerAccessPcrInReview = () => {
  cy.selectTile("Project change requests");
  cy.heading("Project change requests");
  cy.get("a").contains("Review").click();
  cy.heading("Request");
};

export const removePartnerReviewValidateContents = () => {
  [
    ["Partner being removed", "ABS EUI Medium Enterprise"],
    ["Last period", "11"],
    ["Documents", "t02.docx"],
  ].forEach(([item, content]) => {
    cy.getListItemFromKey(item, content);
  });
};

export const removePartnerNextArrow = () => {
  cy.getByQA("arrow-left").contains("Reasoning");
  cy.getByQA("arrow-left").contains("Next").click();
  cy.heading("Reasons for Innovate UK");
};

export const removePartnerPreviousArrow = () => {
  cy.getByQA("arrow-right").contains("Remove a partner");
  cy.getByQA("arrow-right").contains("Previous").click();
  cy.heading("Remove a partner");
};

export const removeManyPartners = () => {
  partnersList.forEach(partner => {
    cy.getByLabel(partner).click();
  });
  cy.button("Save and continue").click();
  cy.get("legend").contains("Upload withdrawal of partner certificate");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Partner being removed", "Hedges' Hedges Ltd");
};

export const navigateToPartnerOrgPage = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.heading("Request");
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
  cy.heading("Request");
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
  cy.heading("Request");
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
  cy.heading("Request");
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

export const completeAddPartnerForMulti = () => {
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
  cy.get("h2").contains("Add person to organisation");
};

export const navigateToPartnerCosts = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.submitButton("Create request").click();
  cy.wait("@pcrPrepare");
  cy.heading("Request");
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
  cy.submitButton("Save and return to labour").click();
  cy.validationLink("Description of role is required");
  cy.validationLink("Gross cost of role is required");
  cy.validationLink("Rate per day is required");
  cy.validationLink("Days spent on project is required");
  cy.get(`input[id="description"]`).type("Law keeper");
  cy.get("h2").contains("Labour");
  cy.get(`input[id="grossCostOfRole"]`).type("50000");
  cy.get(`input[id="ratePerDay"]`).type("500");
  cy.get(`input[id="daysSpentOnProject"]`).clear().type("100");
  cy.wait(500);
  cy.get("div").contains("Total cost will update when saved.");
  cy.get("span").contains("£50,000.00");
  cy.submitButton("Save and return to labour").click();
};

export const addPartnerWholeDaysOnly = () => {
  cy.wait(500);
  cy.get("a").contains("Add a cost").click();
  ["0.5", "-100", "Stuff", "100.32", "$^&&*&)", "100.232321"].forEach(entry => {
    cy.get(`input[id="daysSpentOnProject"]`).clear().type(entry);
    cy.submitButton("Save and return to labour").click();
    cy.validationLink("Days spent on project must be a whole number, like 15");
    cy.reload();
  });
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
  cy.get("dt").contains("Postcode").siblings().contains("a", "Edit");
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
    cy.list(labourGuidance);
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
    cy.paragraph(pGuidance);
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

export const addSourceOfFundingValidation = () => {
  cy.getByQA("add-fund").contains("Add another source of funding").click().wait(500);
  cy.submitButton("Save and continue").click();
  ["Source of funding is required.", "Date secured is required.", "Funding amount is required"].forEach(message => {
    cy.validationLink(message);
  });
  ["Source of funding is required.", "Date secured is required.", "Funding amount is required"].forEach(message => {
    cy.paragraph(message);
  });
  cy.get("#item_0_value").type("error").wait(500);
  cy.validationLink("Funding amount must be a number");
  cy.paragraph("Funding amount must be a number");
  cy.get("#item_0_date_month").type("error");
  cy.validationLink("Date secured must be a date");
  cy.paragraph("Date secured must be a date");
};

export const addSourceOfFunding = () => {
  cy.get("#item_0_description").clear().type("Public");
  cy.get("#item_0_date_month").clear().type("12");
  cy.get("#item_0_date_year").clear().type("2022");
  cy.get("#item_0_value").clear().type("50000");
  cy.wait(500);
};

export const fundingLevelPage = () => {
  cy.get("h2").contains("Funding level");
  cy.paragraph("The maximum the new organisation can enter");
  cy.paragraph("The percentage applied for");
};

export const uploadPartnerInfo = () => {
  cy.get("h2").contains("Upload partner agreement");
  cy.paragraph("You must upload copies of signed letters");
};

export const fundingLevelPercentage = () => {
  cy.get("h2").contains("Funding level");
  cy.get("#awardRate").type("5");
  cy.submitButton("Save and continue").click();
};

export const addPartnerSize = () => {
  cy.get("h2").contains("Size");
  cy.paragraph("This definition must include");
  cy.paragraph("Use the European Commission (EC)");
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
  cy.get("h2").contains("Postcode");
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
    cy.paragraph(guidance);
  }),
    ["your vision for the project", "key objectives", "main areas of focus", "details of how it is innovative"].forEach(
      bullet => {
        cy.list(bullet);
      },
    ),
    cy.heading("Change project scope");
};

export const proposedDescription = () => {
  cy.get("legend").contains("Proposed public description");
  cy.get("span").contains("Published public description").click();
  cy.paragraph("Hello! I am the public description for this Cypress project.");
};

export const newDescriptionEntry = () => {
  cy.get("textarea").type(newPubDescription);
  cy.get("p.character-count.character-count--default.govuk-body").contains("You have 31945 characters remaining");
};

export const proposedSummary = () => {
  cy.get("legend").contains("Proposed project summary");
  cy.get("span").contains("Published project summary").click();
  cy.paragraph("Howdy! I am the public summary for this Cypress project.");
};

export const newSummaryEntry = () => {
  cy.get("textarea").type(newPubSummary);
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
    cy.validationNotification(validation);
  });
  [
    "The knowledge base partner may vire funds between the 'Travel and subsistence' and 'Consumables' cost categories",
    "Funds can also be vired out of these 2 categories into the 'Associate development' category",
    "Virements are subject to approval by the Local Management Committee (LMC).",
    "Requests for virements must be submitted online using the Innovation Funding Service",
  ].forEach(sentence => {
    cy.paragraph(sentence);
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
  cy.get("td").contains("Partner totals").siblings().contains("£40,000.00");
  ["Associate employment", "Travel and subsistence", "Consumables", "Associate development"].forEach(row => {
    cy.get("td").contains(row).siblings().contains("-£10,000.00");
  });
};

export const saveAndReturn = () => {
  cy.get("#grantMovingOverFinancialYear").type("0");
  cy.clickCheckBox("I agree with this change");
  cy.wait(500);
  cy.button("Save and return to request").click({ force: true });
  cy.heading("Request");
};

export const changeNameHeadings = () => {
  cy.heading("Change a partner's name");
  cy.backLink("Back to request");
  shouldShowProjectTitle;
};

export const changeDurationHeadings = () => {
  cy.heading("Change project duration");
  cy.backLink("Back to request");
  shouldShowProjectTitle;
};

export const projectOnHoldHeadings = () => {
  cy.heading("Put project on hold");
  cy.backLink("Back to request");
  shouldShowProjectTitle;
};

export const tickEachPartner = () => {
  cy.paragraph("This will change the partner's name in all projects");
  cy.get("legend").contains("Select partner");
  cy.getByLabel("EUI Small Ent Health").click();
  cy.getByLabel("A B Cad Services").wait(500).click();
  cy.getByLabel("ABS EUI Medium Enterprise").wait(500).click({ force: true });
};

export const saveContinueProceed = () => {
  cy.button("Save and continue").click();
  cy.get("legend").contains("Upload change of name certificate");
  shouldShowProjectTitle;
  cy.heading("Change a partner's name");
};

export const uploadNameChange = () => {
  cy.fileInput("testfile.doc");
  cy.submitButton("Upload").click();
  cy.validationNotification("Your document has been uploaded.");
};

export const summaryOfChanges = () => {
  [
    "Existing name",
    "Proposed name",
    "Change of name certificate",
    "ABS EUI Medium Enterprise",
    "*$%^& Munce Inc",
    "testfile.doc",
    "Edit",
  ].forEach(item => {
    cy.getByQA("name-change-summary-list").contains(item);
  });
};

export const assertChangeNamePage = () => {
  cy.heading("Change a partner's name");
  cy.backLink("Back to request");
  shouldShowProjectTitle;
};

export const completeChangeName = () => {
  cy.get("legend").contains("Mark as complete");
  cy.getByLabel("I agree with this change").click();
  cy.button("Save and return to request").click();
  cy.get("strong").contains("Complete");
};

export const changeNameValidateManyPartners = () => {
  partnersList.forEach(partner => {
    cy.getByLabel(partner).click();
    cy.wait(200);
  });
  cy.button("Save and continue").click();
  cy.get("legend").contains("Upload change of name certificate");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Existing name", "Hedges' Hedges Ltd");
};

export const existingProjectDetails = () => {
  cy.get("h2").contains("Existing project details");
  ["2023", "2024"].forEach(date => {
    cy.getByLabel("Start and end date").contains(date);
    cy.getByLabel("Duration");
    cy.getByLabel("Duration").contains("12 months");
  });
};

export const selectDateDropdown = () => {
  cy.getByLabel("Please select a new date from the available list").select("March 2024");
  cy.getByLabel("Duration");
  cy.getByLabel("Duration").contains("12 months");
};

export const existingSubheadings = () => {
  cy.get("h2").contains("Existing project details");
  ["Start and end date", "2023"].forEach(date => {
    cy.getByQA("currentStartToEndDate").contains(date);
  });
  ["Duration", "12 months"].forEach(duration => {
    cy.getByQA("currentDuration").contains(duration);
  });
};

export const proposedSubheadings = () => {
  cy.get("h2").contains("Proposed project details");
  ["Start and end date", "2024"].forEach(date => {
    cy.getByQA("newStartToEndDate").contains(date);
  });
  cy.get("a").contains("Edit");
  ["Duration", "13 months"].forEach(duration => {
    cy.getByQA("newDuration").contains(duration);
  });
};

export const markAsCompleteSave = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.button("Save and return to request").click();
};

export const populateDateFields = () => {
  cy.get("#suspensionStartDate_month").clear().type("12");
  cy.get("#suspensionStartDate_year").clear().type("2023");
  cy.get("#suspensionEndDate_month").clear().type("03");
  cy.get("#suspensionEndDate_year").clear().type("2024");
};

export const dateChangeSummary = () => {
  cy.get("a").contains("Edit");
  projectOnHoldHeadings;
  ["First day of pause", "2023", "Edit", "Last day of pause (if known)", "2024"].forEach(summary => {
    cy.getByQA("projectSuspension").contains(summary);
  });
};

export const validateAddPerson = () => {
  ["First name", "Last name"].forEach(field => {
    cy.getByLabel(field).clear().type("Thisisovertheagreedlimitforvalidationfiftycharacter");
    cy.button("Save and continue").click();
    cy.validationLink("Finance contact name must be 50 characters or less.");
  }),
    cy.getByLabel("Phone number").clear().type("012345678910111213141");
  cy.getByQA("field-contact1Phone").contains("We may use this to contact the partner");
  cy.button("Save and continue").click();
  cy.validationLink("Finance contact phone number must be 20 characters or less.");
  cy.getByQA("field-contact1Phone").contains("Finance contact phone number must be 20 characters or less.");

  cy.getByLabel("Email")
    .clear()
    .type(
      "ThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThis",
    );
  cy.button("Save and continue").click();
  cy.validationLink("Email address must be 255 characters or less.");
  cy.getByQA("field-contact1Email").contains("Email address must be 255 characters or less.");
  cy.getByQA("field-contact1Forename").contains("Finance contact name must be 50 characters or less.");
  cy.getByQA("field-contact1Surname").contains("Finance contact surname must be 50 characters or less.");
};

export const clearAndEnterValidPersonInfo = () => {
  cy.getByLabel("First name").clear().type("Joseph");
  cy.getByLabel("Last name").clear().type("Dredd");
  cy.getByLabel("Phone number").clear().type("01234567890");
  cy.getByQA("field-contact1Phone").contains("We may use this to contact the partner");
  cy.getByLabel("Email").clear().type("Joseph.dredd@mc1.comtest");
};

export const newInfoValidation = () => {
  cy.submitButton("Save and continue").click();
  cy.validationLink("Select a project role");
  cy.validationLink("Select a partner type");
  cy.paragraph("Select a project role.");
  cy.paragraph("Select a partner type.");
};

export const displayLocationWithGuidance = () => {
  cy.get("h2").contains("Project location");
  cy.getByQA("field-projectLocation").contains("Indicate where the majority");
};

export const locationRadioButtons = () => {
  cy.getByLabel("Inside the United Kingdom").click();
  cy.getByLabel("Outside the United Kingdom").click();
  cy.getByLabel("Inside the United Kingdom").click();
};

export const townAndPostcodeFields = () => {
  cy.get("h2").contains("Name of town or city");
  cy.get("h2").contains("Postcode");
  cy.getByQA("field-projectPostcode").contains("If this is not available,");
};

export const validateChangeName = () => {
  cy.submitButton("Save and continue").click();
  cy.get("legend").contains("Upload change of name certificate");
  cy.submitButton("Save and continue").click();
  cy.get("legend").contains("Mark as complete");
  cy.getByLabel("I agree with this change").click();
  cy.button("Save and return to request").click();
  cy.validationLink("Enter a new partner name.");
  cy.validationLink("Select partner to change.");
  cy.backLink("Back to request").click();
  cy.heading("Request");
  cy.get("a").contains("Change a partner's name").click();
  cy.getByQA("newPartnerName").contains("Edit").click();
};

export const clearAndValidate = () => {
  cy.get("textarea").should("have.value", "Hello! I am the public description for this Cypress project. \\").clear();
  cy.wait(500);
  cy.submitButton("Save and continue").click();
  cy.heading("Change project scope");
  cy.get("textarea").should("have.value", "Howdy! I am the public summary for this Cypress project. \\").clear();
  cy.wait(500);
  cy.submitButton("Save and continue").click();
  cy.get("legend").contains("Mark as complete");
  cy.clickCheckBox("I agree with this change");
  cy.submitButton("Save and return to request").click();
  cy.validationLink("Enter a project summary");
  cy.validationLink("Enter a public description");
  cy.getByQA("newPublicDescription").contains("Edit").click();
};

export const validateDateRequired = () => {
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("Error");
  });
  cy.submitButton("Save and continue").click();
  cy.validationLink("Enter a valid project suspension start date.");
  cy.validationLink("Enter a valid project suspension end date.");
  cy.paragraph("Enter a valid project suspension start date.");
  cy.paragraph("Enter a valid project suspension end date.");
  cy.wait(500);
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("200");
  });
  cy.submitButton("Save and continue").click();
  cy.validationLink("Enter a valid project suspension start date.");
  cy.validationLink("Enter a valid project suspension end date.");
  cy.paragraph("Enter a valid project suspension start date.");
  cy.paragraph("Enter a valid project suspension end date.");
  cy.wait(500);
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("-200");
  });
  cy.submitButton("Save and continue").click();
  cy.validationLink("Enter a valid project suspension start date.");
  cy.validationLink("Enter a valid project suspension end date.");
  cy.paragraph("Enter a valid project suspension start date.");
  cy.paragraph("Enter a valid project suspension end date.");
  cy.wait(500);
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("%^&*");
  });
  cy.submitButton("Save and continue").click();
  cy.validationLink("Enter a valid project suspension start date.");
  cy.validationLink("Enter a valid project suspension end date.");
  cy.paragraph("Enter a valid project suspension start date.");
  cy.paragraph("Enter a valid project suspension end date.");
};

export const validateGrantMoving = () => {
  cy.get("input#grantMovingOverFinancialYear").type("Error");
  cy.get("h2").contains("Mark as complete");
  cy.clickCheckBox("I agree with this change");
  cy.submitButton("Save and return to request").click();
  cy.validationLink("The value of a grant moving over financial year must be numerical.");
  cy.clickCheckBox("I agree with this change");
};

export const validatePcrDurationPage = () => {
  cy.submitButton("Submit request").click();
  cy.validationLink("Reasons entry must be complete.");
  cy.validationLink("Change project duration must be complete.");
  cy.paragraph("Reasons entry must be complete.");
  cy.paragraph("Change project duration must be complete.");
  cy.reload();
};

export enum PcrItemType {
  ReallocateProjectCosts = "Reallocate project costs",
  RemoveAPartner = "Remove a partner",
  AddAPartner = "Add a partner",
  ChangeProjectScope = "Change project scope",
  ChangeProjectDuration = "Change project duration",
  ChangeAPartnerName = "Change a partner's name",
  PutAProjectOnHold = "Put project on hold",
}

const pcrArray = [
  PcrItemType.ReallocateProjectCosts,
  PcrItemType.RemoveAPartner,
  PcrItemType.AddAPartner,
  PcrItemType.ChangeProjectScope,
  PcrItemType.ChangeProjectDuration,
  PcrItemType.ChangeAPartnerName,
  PcrItemType.PutAProjectOnHold,
];

export const multiPcrArray = [
  PcrItemType.ReallocateProjectCosts,
  PcrItemType.AddAPartner,
  PcrItemType.ChangeProjectScope,
  PcrItemType.ChangeProjectDuration,
  PcrItemType.ChangeAPartnerName,
  PcrItemType.PutAProjectOnHold,
];

const addTypeArray = ["Remove a partner", "Add a partner", "Change a partner's name"];

export const addPcrTypes = (button: string) => {
  addTypeArray.forEach(pcr => {
    cy.clickCheckBox(pcr);
  });
  cy.submitButton(button).click();
  cy.get("h1").contains("Request", { timeout: 60000 });
};

export const addTypesForValidation = (button: string) => {
  addTypeArray.forEach(pcr => {
    cy.clickCheckBox(pcr);
  });
  cy.submitButton(button).click();
  cy.validationLink(
    "You cannot select ‘Remove a partner’ and ‘Change a partner’s name’ because you do not have enough partners to action these.",
  );
  cy.paragraph(
    "You cannot select ‘Remove a partner’ and ‘Change a partner’s name’ because you do not have enough partners to action these.",
  );
};

export const selectEachPcr = () => {
  pcrArray.forEach(pcr => {
    cy.clickCheckBox(pcr);
  });
  cy.submitButton("Create request").click();
  cy.get("h1").contains("Request", { timeout: 60000 });
  cy.wait(5000);
};

export const confirmPcrsAdded = () => {
  pcrArray.forEach(pcr => {
    cy.getByQA("typesRow").contains(pcr);
  });
  pcrArray.forEach(pcr => {
    cy.getByQA("WhatDoYouWantToDo").contains("a", pcr);
  });
};

export const submitWithoutCompleting = () => {
  cy.submitButton("Submit request").click();
  pcrArray.forEach(pcr => {
    cy.validationLink(pcr);
  });
  pcrArray.forEach(pcr => {
    cy.paragraph(pcr + " must be complete.");
  });
};

export const backOutCreateNewPcr = () => {
  cy.backLink("Back to project change requests").click();
  cy.get("a").contains("Create request").click();
  cy.heading("Start a new request");
};

export const assertForMissingPcrTypes = () => {
  cy.get("a").contains("Add types").click();
  cy.heading("Add types");
  cy.get("span").contains("Learn about why some PCR types are missing").click();
  cy.get("details").should("have.attr", "open");
  [
    PcrItemType.ReallocateProjectCosts,
    PcrItemType.RemoveAPartner,
    PcrItemType.ChangeProjectScope,
    PcrItemType.ChangeProjectDuration,
    PcrItemType.ChangeAPartnerName,
    PcrItemType.PutAProjectOnHold,
  ].forEach(pcr => {
    cy.list(pcr);
  });
  [
    PcrItemType.ReallocateProjectCosts,
    PcrItemType.RemoveAPartner,
    PcrItemType.ChangeProjectScope,
    PcrItemType.ChangeProjectDuration,
    PcrItemType.ChangeAPartnerName,
    PcrItemType.PutAProjectOnHold,
  ].forEach(pcr => {
    cy.get("label").should("not.have.text", pcr);
  });
  cy.get("a").contains("Cancel").click();
  cy.heading("Request");
};

export const assertForMissingTypesNewPcr = () => {
  cy.get("span").contains("Learn about why some PCR types are missing").click();
  cy.get("details").should("have.attr", "open");
  [PcrItemType.ReallocateProjectCosts, PcrItemType.ChangeProjectScope, PcrItemType.ChangeProjectDuration].forEach(
    pcr => {
      cy.list(pcr);
    },
  );
  [PcrItemType.ReallocateProjectCosts, PcrItemType.ChangeProjectScope, PcrItemType.ChangeProjectDuration].forEach(
    pcr => {
      cy.get("label").should("not.have.text", pcr);
    },
  );
};

export const assertForMissingTypesReaccessed = () => {
  cy.get("span").contains("Learn about why some PCR types are missing").click();
  cy.get("details").should("have.attr", "open");
  cy.paragraph("Some types are unavailable because you have reached the maximum number of this type in a single PCR.");
  cy.paragraph("Some types are unavailable because they have already been added to this PCR.");
  [
    PcrItemType.ReallocateProjectCosts,
    PcrItemType.RemoveAPartner,
    PcrItemType.ChangeProjectScope,
    PcrItemType.ChangeAPartnerName,
    PcrItemType.PutAProjectOnHold,
  ].forEach(pcr => {
    cy.list(pcr);
  });
  [
    PcrItemType.ReallocateProjectCosts,
    PcrItemType.RemoveAPartner,
    PcrItemType.ChangeProjectScope,
    PcrItemType.ChangeAPartnerName,
    PcrItemType.PutAProjectOnHold,
  ].forEach(pcr => {
    cy.get("label").should("not.have.text", pcr);
  });
  cy.clickCheckBox("Add a partner");
};

export const backOutAndDelete = () => {
  cy.backLink("Back to project change requests").click();
  cy.heading("Project change requests");
  cy.get("td").contains("Draft").siblings().contains("a", "Delete").click();
};

export const verifyDeletePageLoads = () => {
  cy.backLink("Back to project change requests");
  cy.heading("Delete draft request");
  shouldShowProjectTitle;
};

export const deletionWarningMessage = () => {
  cy.validationNotification("All the information will be permanently deleted.");
};

export const validateTable = () => {
  cy.getByQA("requestNumber").contains("Request");
  cy.getByQA("started").contains("Started").siblings().contains(createdDay);
  cy.get("dt").contains("Last updated").siblings().contains(createdDay);
  pcrArray.forEach(type => {
    cy.getByQA("types").contains(type);
    cy.wait(500);
  });
};

export const deleteAndConfirm = () => {
  cy.button("Delete request").click();
  cy.heading("Project change requests");
  multiPcrArray.forEach(type => {
    cy.getByQA("pcrs-active").should("not.contain", type);
  });
};

export const switchUserMoReviewPcr = () => {
  cy.switchUserTo(moEmail);
  cy.get("a").contains("Review").click();
  cy.heading("Request");
};

export const leaveCommentQuery = () => {
  cy.getByLabel("Query the request").click();
  cy.get("textarea").clear().type(comments);
  cy.button("Submit").click();
  cy.get("h1").contains("Project change requests");
};

export const switchUserCheckForComments = () => {
  cy.switchUserTo(pmEmail);
  cy.get("a").contains("Edit").click();
  cy.get("h1").contains("Request");
  cy.reload();
  cy.get("span").contains("Show").click();
  cy.getByQA("projectChangeRequestStatusChangeTable").find("tr").eq(1).contains("Javier Baez");
  cy.getByQA("projectChangeRequestStatusChangeTable").find("tr").eq(2).contains(comments);
};

export const enterCommentsSubmit = () => {
  cy.get("textarea").clear().type(comments);
  cy.button("Submit request").click();
  cy.heading("Project change request submitted");
};

/**
 * This is not a definitive test without cross-checking Salesforce. But given GQL, it will assert for greater that 10 items displayed on page.
 */
export const pcrStatusTable = () => {
  cy.getByQA("projectChangeRequestStatusChangeTable")
    .find("tr")
    .then(row => {
      let rowNumber = row.length;
      if (rowNumber < 20) {
        throw new Error("Test failed to find correct number of rows");
      }
    });
};

export const switchToMoCheckComments = () => {
  cy.switchUserTo(moEmail);
  cy.get("h1").contains("Project change requests");
  cy.tableCell("Submitted to Monitoring Officer").siblings().contains("Review").click();
  cy.get("h1").contains("Request");
  cy.get("span").contains("Show").click();
  cy.getByQA("projectChangeRequestStatusChangeTable").find("tr").eq(1).contains("James Black");
  cy.getByQA("projectChangeRequestStatusChangeTable").find("tr").eq(2).contains(comments);
};

export const createChangeScope = () => {
  cy.button("Create request").click();
  cy.heading("Start a new request");
  cy.clickCheckBox("Change project scope");
  cy.wait(500);
  cy.button("Create request").click();
  cy.heading("Request");
};

export const populateCommentsAndSave = () => {
  cy.get("textarea").clear().type(standardComments);
  cy.wait(500);
  cy.button("Save and return to requests").click();
  cy.heading("Project change requests");
};

export const accessPcrCheckForComments = () => {
  cy.tableCell("Draft").siblings().contains("Edit").click();
  cy.heading("Request");
  cy.get("textarea").should("have.value", standardComments);
};

export const backOutToProjOverview = () => {
  cy.backLink("Back to project change requests").click();
  cy.heading("Start a new request");
  cy.backLink("Back to project").click();
  cy.heading("Project overview");
};

export const switchToFc = () => {
  let fcEmail = "contact77@test.co.uk";
  cy.wait(500);
  cy.switchUserTo(fcEmail);
  cy.reload();
  cy.get("#user-switcher-manual-input").should("have.value", fcEmail);
};

export const correctPcrHeaders = () => {
  let col = 1;
  ["Request number", "Types", "Started", "Status", "Last updated"].forEach(heading => {
    cy.get("tr")
      .eq(0)
      .within(() => {
        cy.get(`th:nth-child(${col})`).contains(heading);
        col++;
      });
  });
};

export const existingPcrTable = () => {
  [
    ["1421", "Remove a partner", "27 Feb 2023", "Submitted to Monitoring Officer", "27 Feb 2023"],
    ["1419", "Remove a partner", "27 Feb 2023", "Queried to Project Manager", "27 Feb 2023"],
  ].forEach(([reqNo, types, started, status, lastUpdated], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(1)`).contains(reqNo);
        cy.get(`td:nth-child(2)`).contains(types);
        cy.get(`td:nth-child(3)`).contains(started);
        cy.get(`td:nth-child(4)`).contains(status);
        cy.get(`td:nth-child(5)`).contains(lastUpdated);
        index++;
      });
  });
};

/**
 * Note the '.each' below is necessary because cypress concatenates all elements and looks for the contents.
 * We must therefore look at each element separately to assert this text does not exist against each rather than across all elements
 */
export const validatePartialDate = () => {
  cy.get("#suspensionStartDate_month").clear().type("Error");
  cy.get("#suspensionStartDate_year").clear().type("2023");
  cy.get("#suspensionEndDate_month").clear().type("03");
  cy.get("#suspensionEndDate_year").clear().type("2024");
  cy.submitButton("Save and continue").click();
  cy.validationLink("Enter a valid project suspension start date.");
  cy.get("a").each($a => {
    cy.wrap($a).should("not.have.text", "The last day of pause cannot be before the first day of pause.");
  });
  cy.paragraph("Enter a valid project suspension start date.");
  cy.get("a").each($p => {
    cy.wrap($p).should("not.have.text", "The last day of pause cannot be before the first day of pause.");
  });
};

export const validateFutureStartDate = () => {
  cy.get("#suspensionStartDate_month").clear().type("12");
  cy.get("#suspensionStartDate_year").clear().type("2024");
  cy.get("#suspensionEndDate_month").clear().type("03");
  cy.get("#suspensionEndDate_year").clear().type("2023");
  cy.button("Save and continue").click();
  cy.validationLink("The last day of pause cannot be before the first day of pause.");
};

export const backToPcrs = () => {
  cy.backLink("Back to project change requests").click();
  cy.heading("Project change requests");
  cy.go("back");
  cy.heading("Request");
};

export const onHoldDetails = () => {
  cy.get("h2").contains("Details");
  cy.getListItemFromKey("Request number", "2");
  cy.getListItemFromKey("Types", "Put project on hold");
};

export const onHoldGiveUsInfo = () => {
  cy.get("h2").contains("Give us information");
  cy.get("a").contains("Put project on hold");
  cy.get("strong").contains("Complete");
};

export const backToRequest = () => {
  cy.backLink("Back to request").click();
  cy.heading("Request");
};

export const workingNextArrow = () => {
  cy.getByQA("arrow-left").contains("Next");
  cy.getByQA("arrow-left").contains("Reasoning").click();
  cy.heading("Reasons for Innovate UK");
};

export const onHoldRequestDetails = () => {
  [
    ["Request number", "2"],
    ["Types", "Put project on hold"],
    ["Comments", "These are test comments for Put project on hold."],
    ["Files", "testfile.doc"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const workingPreviousArrow = (name: string) => {
  cy.getByQA("arrow-right").contains("Previous");
  cy.getByQA("arrow-right").contains(name).click();
  cy.heading(name);
};

export const changeNameListItems = () => {
  [
    ["Existing name", "ABS EUI Medium Enterprise", "Edit"],
    ["Proposed name", "*$%^& Munce Inc", "Edit"],
    ["Change of name certificate", "testfile.doc", "Edit"],
  ].forEach(([key, item, edit]) => {
    cy.contains("dt", key).siblings().contains(item);
    cy.contains("dt", key).siblings().contains(edit);
  });
};

export const changeNameClickEachEdit = () => {
  [
    ["Existing name", "Edit"],
    ["Proposed name", "Edit"],
  ].forEach(([key, edit]) => {
    cy.contains("dt", key).siblings().contains(edit).click();
    cy.heading("Change a partner's name");
    cy.go("back");
    cy.heading("Request");
    cy.get("a").contains("Change a partner's name").click();
    cy.heading("Change a partner's name");
  });
  cy.contains("dt", "Change of name certificate").siblings().contains("Edit").click();
  cy.heading("Change a partner's name");
  cy.get("legend").contains("Upload change of name certificate");
  cy.go("back");
  cy.heading("Request");
  cy.get("a").contains("Change a partner's name").click();
  cy.heading("Change a partner's name");
};

const documentPaths = documents.map(doc => `cypress/documents/${doc}`);

export const pcrAllowBatchFileUpload = (documentType: string) => {
  cy.intercept("POST", `/api/documents/${documentType}/**`).as("filesUpload");
  cy.get(`input[type="file"]`)
    .wait(seconds(1))
    .selectFile(documentPaths, { force: true, timeout: seconds(5) });
  cy.wait(seconds(1)).submitButton("Upload documents").trigger("focus").click();
  cy.wait("@filesUpload");
};

export const removeFileDelete = () => {
  cy.get("tr")
    .eq(1)
    .within(() => {
      cy.tableCell("Remove").click();
    });
  cy.validationNotification(`'${testFile}' has been removed.`);
};
