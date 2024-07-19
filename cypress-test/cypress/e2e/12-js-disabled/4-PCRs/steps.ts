import { PcrType } from "typings/pcr";
import { documents, uploadDate } from "e2e/2-claims/steps";
import { seconds } from "common/seconds";
import { testFile } from "common/testfileNames";
import { loremIpsum256Char } from "common/lorem";
import { Heading } from "typings/headings";
import { Tile } from "typings/tiles";
import { CostCategory } from "typings/costCategory";

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

export const statusAndCommentsLog = () => {
  cy.contains("h2", "Status and comments log");
};

export const createRequestButton = () => {
  cy.get("a.govuk-link.govuk-button").click();
};
/**
 * UNCOMMENT IN 10795 ONCE SUBCONTRACTOR IS READY FOR DEV.
 */
export const pcrCheckboxesWithHint = () => {
  [
    ["Reallocate project costs", "This allows you to move costs from one category to another."],
    ["Remove a partner", "Use this when a partner is leaving the project and is ready to submit their final claim."],
    [
      "Add a partner",
      "This allows you to add a new partner to a project. When adding a new partner to replace an existing one, also use 'Remove a partner' to remove the existing one.",
    ],
    ["Change project scope", "Use this to update the public project description and the internal project summary."],
    ["Change project duration", "This allows you to request an extension or reduction to your project's duration."],
    [
      "Change a partner's name",
      "Use when a partner organisation's name has changed. If a partner is being replaced, use ‘Remove a partner’ to delete the old one and ‘Add a partner’ to add the new one.",
    ],
    ["Approve a new subcontractor", "If you are requesting a change in subcontractor, please select this option."],
    [
      "Put project on hold",
      "This allows you to suspend a project for a specific period. You cannot submit any claims, costs, drawdown requests or raise project change requests when the project is on hold.",
    ],
  ].forEach(([pcrType, hint]) => {
    cy.getByLabel(pcrType);
    cy.get(".govuk-hint").contains(hint);
  });
};

/**
 * UNCOMMENT IN 10795 ONCE SUBCONTRACTOR IS READY FOR DEV.
 */
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
  cy.clickCheckBox<PcrType>("Approve a new subcontractor");
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
  cy.clickCheckBox<PcrType>("Approve a new subcontractor", true);
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
  ["testfile.doc", fileName, uploadDate, "0KB", uploadedBy].forEach((rowItem, index) => {
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
  cy.clickOn("Save and continue");
};

export const completeNewPartnerInfoAsResearch = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Research").click();
  cy.clickOn("Save and continue");
};

export const completeNewPartnerInfoAsRto = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Research and Technology Organisation (RTO)").click();
  cy.clickOn("Save and continue");
};

export const completeNewPartnerInfoAsPublic = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Public Sector, charity or non Je-S registered research organisation").click();
  cy.clickOn("Save and continue");
};

export const completeNewPartnerInfoNonAid = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("No").click();
  cy.getByLabel("Research").click();
  cy.clickOn("Save and continue");
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
  cy.get("legend").contains("Project outputs");
  cy.get("label").contains("Will the new partner's work on the project be mostly commercial or economic");
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
  cy.contains("Save and continue");
  cy.contains("Save and return to summary");
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

/**
 * Commented out until the hint is re-enabled in the app.
 */
export const searchCompanyHouseGuidance = () => {
  cy.getByLabel("Search companies house");
  // cy.get("#hint-for-search").contains("Enter the name of the organisation that you work for.");
  //cy.paragraph("Is your organisation not showing in these results?");
};

export const specialCharInput = () => {
  ["&", "!", "£", "$", "%", "^", "*", "(", ")", "-", "+", "=", "////", "|"].forEach(specChar => {
    cy.get("#search").clear().type(specChar).wait(1000);
    cy.getByQA("error-summary").should("not.exist");
  });
};

export const typeASearchResults = () => {
  cy.get("#search").clear().type("A").wait(500);
  cy.clickOn("button", "Search");
  cy.get("h2").contains("Companies house search results");
  cy.getByLabel("A LIMITED").click();
};

export const swindonUniResults = () => {
  cy.get("#searchJesOrganisations").clear().type("University");
  cy.clickOn("Search");
  cy.get("h2").contains("Je-S search results");
  cy.getByLabel("University of Bristol");
  cy.getByLabel("Swindon University").click();
};

export const companyHouseAutofillAssert = () => {
  cy.clickOn("Autofill result");
  const vals = [
    ["organisationName", "A LIMITED"],
    ["registrationNumber", "11790215"],
    ["registeredAddress", "38 Springfield Road, Gillingham, Kent, England, ME7 1YJ"],
  ] as const;

  vals.forEach(([id, value]) => {
    cy.get(`input#${id}`).should($input => {
      expect($input.val()).to.include(value);
    });
  });
};

export const projectRoleRadios = () => {
  cy.get("legend").contains("Project role");
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
  [
    [
      "EUI Small Ent Health (Lead)",
      "£350,000.00",
      "£350,000.00",
      "£227,500.00",
      "£350,000.00",
      "£350,000.00",
      "£227,500.00",
    ],
    ["A B Cad Services", "£175,000.00", "£175,000.00", "£113,750.00", "£175,000.00", "£175,000.00", "£113,750.00"],
    ["ABS EUI Medium Enterprise", "£50,000.00", "£1,000.00", "£650.00", "£50,000.00", "£1,000.00", "£650.00"],
  ].forEach(
    ([partner, totalEl, remainingCosts, remainingGrant, newTotalEl, newRemainingCosts, newRemainingGrant], index) => {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get(`td:nth-child(1)`).contains(partner);
          cy.get(`td:nth-child(2)`).contains(totalEl);
          cy.get(`td:nth-child(3)`).contains(remainingCosts);
          cy.get(`td:nth-child(4)`).contains(remainingGrant);
          cy.get(`td:nth-child(5)`).contains(newTotalEl);
          cy.get(`td:nth-child(6)`).contains(newRemainingCosts);
          cy.get(`td:nth-child(7)`).contains(newRemainingGrant);
        });
    },
  );
  ["Project totals", "£575,000.00", "£526,000.00", "£341,900.00", "£575,000.00", "£526,000.00", "£341,900.00"].forEach(
    (total, index) => {
      cy.get("tfoot").within(() => {
        cy.get("tr").within(() => {
          cy.get(`th:nth-child(${index + 1})`).contains(total);
        });
      });
    },
  );
};

export const partnerRadioButtons = () => {
  ["EUI Small Ent Health", "A B Cad Services", "ABS EUI Medium Enterprise"].forEach(partner => {
    cy.getByLabel(partner);
  });
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
  cy.validationLink("Enter removal period");
  cy.validationLink("Select existing partner to remove from this project.");
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
    cy.validationLink("Enter removal period");
    cy.paragraph("Enter removal period");
  });
};

export const clickPartnerAddPeriod = () => {
  cy.getByLabel("EUI Small Ent Health").click();
  cy.getByLabel("When is their last period?").clear().type("3");
  cy.clickOn("Save and continue");
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
    ["Partner being removed", "Select existing partner to remove"],
    ["Last period", "When is their last period?"],
    ["Documents", "Upload withdrawal of partner certificate"],
  ].forEach(([key, subheading]) => {
    cy.getListItemFromKey(key, "Edit").click();
    cy.contains(subheading);
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
  cy.clickOn("Save and continue");
  cy.get("h2").contains("State aid eligibility");
  cy.clickOn("Save and continue");
  cy.getByLabel("Search companies house");
  cy.get("#search").type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.getByLabel(`A LIMITED`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.clickOn("Save and continue");
};

export const navigateToFinancialsPage = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.clickOn("Create request");
  cy.wait("@pcrPrepare");
  cy.heading("Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.clickOn("Save and continue");
  cy.get("h2").contains("State aid eligibility");
  cy.clickOn("Save and continue");
  cy.getByLabel("Search companies house");
  cy.get("#search").type("A").wait(500);
  cy.get("h2").contains("Companies house search results");
  cy.getByLabel(`A LIMITED`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.clickOn("Save and continue");
};

export const navigateToPartnerLocation = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.clickOn("Create request");
  cy.wait("@pcrPrepare");
  cy.heading("Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.clickOn("Save and continue");
  cy.get("h2").contains("State aid eligibility");
  cy.clickOn("Save and continue");
  cy.get(`input[id="search"]`).type("A").wait(500);
  cy.getByLabel(`A LIMITED`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Financial details");
  cy.get("#financialYearEndDate_month").type("03");
  cy.get("#financialYearEndDate_year").type("2022");
  cy.get("#financialYearEndTurnover").type("1000000");
  cy.clickOn("Save and continue");
};

export const navigateToPartnerPerson = () => {
  cy.clickCheckBox("Add a partner");
  cy.intercept("POST", "/api/pcrs/*").as("pcrPrepare");
  cy.clickOn("Create request");
  cy.wait("@pcrPrepare");
  cy.heading("Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.clickOn("Save and continue");
  cy.get("h2").contains("State aid eligibility");
  cy.clickOn("Save and continue");
  cy.getByLabel("Search companies house").type("A").wait(500);
  cy.getByLabel("A LIMITED").click();
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get("#numberOfEmployees").type("1000");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Financial details");
  cy.get("#financialYearEndDate_month").type("03");
  cy.get("#financialYearEndDate_year").type("2022");
  cy.get("#financialYearEndTurnover").type("1000000");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Project location");
  cy.getByLabel("Inside the United Kingdom").click();
  cy.getByLabel("Name of town or city").type("Swindon");
  cy.getByLabel("Postcode").type("SN5");
  cy.clickOn("Save and continue");
};

export const completeAddPartnerForMulti = () => {
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.clickOn("Save and continue");
  cy.get("h2").contains("State aid eligibility");
  cy.clickOn("Save and continue");
  cy.get(`input[id="search"]`).type("A").wait(500);
  cy.getByLabel(`A LIMITED`).click();
  cy.get(`input[id="organisationName"], [value="A LIMITED"]`);
  cy.get(`input[id="registrationNumber"], [value="11790215"]`);
  cy.get(`input[id="registeredAddress"], [value="Springfield Road"]`);
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Organisation details");
  cy.getByLabel("Large").click();
  cy.get(`input[id="numberOfEmployees"]`).type("1000");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Financial details");
  cy.get("#financialYearEndDate_month").type("03");
  cy.get("#financialYearEndDate_year").type("2022");
  cy.get("#financialYearEndTurnover").type("1000000");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Project location");
  cy.getByLabel("Inside the United Kingdom").click();
  cy.getByLabel("Name of town or city").type("Swindon");
  cy.getByLabel("Postcode").type("SN5");
  cy.clickOn("Save and continue");
  cy.get("h2").contains("Add person to organisation");
};

export const navigateToPartnerCosts = () => {
  cy.createPcr("Add a partner");
  cy.heading("Request");
  cy.get("a").contains("Add a partner").click();
  cy.getByLabel("Collaborator").click();
  cy.getByLabel("Yes").click();
  cy.getByLabel("Business").click();
  cy.clickOn("Save and return to summary");
  cy.getListItemFromKey("Project costs for new partner", "Edit").click();
  cy.get("h2").contains("Project costs for new partner");
};

export const pcrNewCostCatLineItem = () => {
  cy.submitButton("Save and return to labour").click();
  cy.validationLink("Enter description of role.");
  cy.validationLink("Enter gross cost of role.");
  cy.validationLink("Enter rate per day.");
  cy.validationLink("Enter days spent on project.");
  cy.get("h2").contains("Labour");
  cy.wait(200);
  cy.getByLabel("Role within project").type("Law keeper");
  cy.wait(200);
  cy.getByLabel("Gross employee cost").type("50000");
  cy.wait(200);
  cy.getByLabel("Rate (£/day)").type("500");
  cy.wait(200);
  cy.getHintFromLabel("Rate (£/day)").contains(
    "This should be calculated from the number of working days for this role per year.",
  );
  cy.wait(200);
  cy.getByLabel("Days to be spent by all staff with this role").clear().type("100");
  cy.wait(200);
  cy.get("div").contains("Total cost will update when saved.");
  cy.get("span").contains("£50,000.00");
  cy.submitButton("Save and return to labour").click();
};

export const validateAddPartnerDaysOnProject = () => {
  cy.wait(250);
  cy.get("a").contains("Add a cost").click();
  ["0.5", "Stuff", "100.32", "$^&&*&)", "100.232321"].forEach(entry => {
    cy.getByLabel("Days to be spent by all staff with this role").clear().type(entry);
    cy.wait(250);
    cy.submitButton("Save and return to labour").click();
    cy.validationLink("Days spent on project must be a whole number, like 15.");
  });

  ["-100"].forEach(entry => {
    cy.getByLabel("Days to be spent by all staff with this role").clear().type(entry);
    cy.wait(250);
    cy.submitButton("Save and return to labour").click();
    cy.validationLink("Days spent on project must be 0 or more.");
  });

  cy.getByLabel("Days to be spent by all staff with this role").clear();
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
  cy.tableHeader("Total other funding");
};

export const addSourceOfFundingValidation = () => {
  cy.button("Add another source of funding").click().wait(500);
  cy.clickOn("Save and continue");
  ["Source of funding is required.", "Date secured is required.", "Funding amount is required"].forEach(message => {
    cy.validationLink(message);
  });
  ["Source of funding is required.", "Date secured is required.", "Funding amount is required"].forEach(message => {
    cy.paragraph(message);
  });
  cy.getCellFromHeaderAndRowNumber("Funding amount (£)", 1, `[aria-label="funding amount for item 0"]`)
    .type("error")
    .wait(500);
  cy.validationLink("Funding amount must be a number");
  cy.paragraph("Funding amount must be a number");
  cy.getCellFromHeaderAndRowNumber("Date secured", 1, '[aria-label="year funding is secured for item 1"]')
    .type("error")
    .wait(500)
    .blur();

  cy.validationLink("Date secured must be a date");
  cy.paragraph("Date secured must be a date");
};

export const fundingLevelPage = () => {
  cy.get("h2").contains("Funding level");
  cy.paragraph("The maximum the new organisation can enter");
  cy.paragraph("The percentage applied for");
};

export const uploadPartnerInfo = () => {
  cy.get("legend").contains("Upload partner agreement");
  cy.paragraph("You must upload copies of signed letters");
};

export const validateFundingLevelInput = () => {
  ["99.333", "999.999", "222.22222222222", "100.22222"].forEach(entry => {
    cy.get("#awardRate").clear().type(entry);
    cy.clickOn("Save and continue");
    cy.validationLink("Funding level must be 2 decimal places or fewer.");
    cy.paragraph("Funding level must be 2 decimal places or fewer.");
  });

  ["200", "2000", "101", "100.01"].forEach(input => {
    cy.get("#awardRate").clear().type(input);
    cy.clickOn("Save and continue");
    cy.validationLink("Enter funding level up to 100%.");
    cy.paragraph("Enter funding level up to 100%.");
  });

  ["Lorem", "one hundred", "1 0 0", "£$%^*", "-100", "This is far too long for a percentage input"].forEach(input => {
    cy.get("#awardRate").clear().type(input);
    cy.clickOn("Save and continue");
    cy.validationLink("Enter funding level.");
    cy.paragraph("Enter funding level.");
  });
};

export const fundingLevelPercentage = () => {
  cy.get("h2").contains("Funding level");
  cy.get("#awardRate").clear().type("5");
  cy.clickOn("Save and continue");
};

export const addPartnerSize = () => {
  cy.get("legend").contains("Size");
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
  cy.getByLabel("Yes").click();
  cy.getByLabel("No").click();
  cy.getByLabel("Yes").click();
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
};

export const proposedSummary = () => {
  cy.get("legend").contains("Proposed project summary");
  cy.get("span").contains("Published project summary").click();
  cy.paragraph("Howdy! I am the public summary for this Cypress project.");
};

export const newSummaryEntry = () => {
  cy.get("textarea").type(newPubSummary);
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
    "This project does not follow the normal grant calculation rules (costs claimed × funding award rate).",
    "The partner may have one or more cost categories paid at a different funding award rate compared to your overall funding award rate.",
    "Cost category associate development is paid at a rate of 5% rather than your normal award rate",
    "Cost category associate employment is paid at a rate of 70% rather than your normal award rate",
    "Cost category consumables is paid at a rate of 11.11% rather than your normal award rate",
    "Cost category travel and subsistence is paid at a rate of 20% rather than your normal award rate",
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

/**
 * Note loremIpsum256Char is not returning 256 characters but 255.
 * You will see I am typing 'tt' in order to exceed the 256 limit and enter total of 257 to prompt validation.
 */
export const exceedNewNamePromptValidation = () => {
  cy.get("#accountName").invoke("val", loremIpsum256Char).trigger("input");
  cy.wait(1000);
  cy.get("#accountName").wait(500).type("{moveToEnd}tt");
  cy.button("Save and continue").click();
  cy.validationLink("New partner name must be 256 characters or less");
  cy.paragraph("New partner name must be 256 characters or less");
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
  ["2024", "2025"].forEach(date => {
    cy.getByLabel("Start and end date").contains(date);
    cy.getByLabel("Duration");
    cy.getByLabel("Duration").contains("12 months");
  });
};

export const selectDateDropdown = () => {
  cy.getByLabel("Please select a new date from the available list").select("December 2025");
};

export const existingSubheadings = () => {
  cy.get("h2").contains("Existing project details");
  ["Start and end date", "2024"].forEach(date => {
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
  ["Duration", "22 months"].forEach(duration => {
    cy.getByQA("newDuration").contains(duration);
  });
};

export const markAsCompleteSave = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.button("Save and return to request").click();
  cy.heading("Request");
};

export const populateDateFields = () => {
  cy.get("#suspensionStartDate_month").clear().type("12");
  cy.get("#suspensionStartDate_year").clear().type("2024");
  cy.get("#suspensionEndDate_month").clear().type("03");
  cy.get("#suspensionEndDate_year").clear().type("2025");
};

export const dateChangeSummary = () => {
  cy.get("a").contains("Edit");
  projectOnHoldHeadings;
  ["First day of pause", "2024", "Edit", "Last day of pause (if known)", "2025"].forEach(summary => {
    cy.getByQA("projectSuspension").contains(summary);
  });
};

export const validateAddPerson = () => {
  ["First name", "Last name"].forEach(field => {
    cy.getByLabel(field).clear().type("Thisisovertheagreedlimitforvalidationfiftycharacter");
    cy.clickOn("Save and continue");
    cy.validationLink("Finance contact first name must be 50 characters or less.");
  }),
    cy.getByLabel("Phone number").clear().type("012345678910111213141");
  cy.getHintFromLabel("Phone number").contains(
    "We may use this to contact the partner for more information about this request.",
  );
  cy.button("Save and continue").click();
  cy.validationLink("Finance contact phone number must be 20 characters or less.");
  // cy.getByQA("field-contact1Phone").contains("Finance contact phone number must be 20 characters or less.");
  cy.getErrorFromLabel("Phone number").contains("Finance contact phone number must be 20 characters or less.");

  cy.getByLabel("Email")
    .clear()
    .type(
      "ThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThismustbetwohundredandfiftycharactersonlyThis",
    );
  cy.button("Save and continue").click();
  cy.validationLink("Finance contact email address must be 255 characters or less.");
  cy.getErrorFromLabel("Email").contains("Finance contact email address must be 255 characters or less.");
  cy.getErrorFromLabel("First name").contains("Finance contact first name must be 50 characters or less.");
  cy.getErrorFromLabel("Last name").contains("Finance contact last name must be 50 characters or less.");
};

export const clearAndEnterValidPersonInfo = () => {
  cy.getByLabel("First name").clear().type("Joseph");
  cy.getByLabel("Last name").clear().type("Dredd");
  cy.getByLabel("Phone number").clear().type("01234567890");
  cy.getHintFromLabel("Phone number").contains("We may use this to contact the partner");
  cy.getByLabel("Email").clear().type("Joseph.dredd@mc1.comtest");
};

export const newInfoValidation = () => {
  cy.clickOn("Save and continue");
  cy.validationLink("Select project role");
  cy.validationLink("Select partner type");
  cy.paragraph("Select project role.");
  cy.paragraph("Select partner type.");
};

export const displayLocationWithGuidance = () => {
  cy.get("h2").contains("Project location");
  cy.contains("Indicate where the majority of the work being done by this partner will take place");
};

export const locationRadioButtons = () => {
  cy.getByLabel("Inside the United Kingdom").click();
  cy.getByLabel("Outside the United Kingdom").click();
  cy.getByLabel("Inside the United Kingdom").click();
};

export const townAndPostcodeFields = () => {
  cy.get("label").contains("Name of town or city");
  cy.get("label").contains("Postcode");
  cy.contains("If this is not available, leave this blank.");
};

export const validateChangeName = () => {
  cy.clickOn("Save and continue");
  cy.get("legend").contains("Upload change of name certificate");
  cy.clickOn("Save and continue");
  cy.get("legend").contains("Mark as complete");
  cy.getByLabel("I agree with this change").click();
  cy.button("Save and return to request").click();
  cy.validationLink("Enter new partner name.");
  cy.validationLink("Select existing partner to change.");
  cy.backLink("Back to request").click();
  cy.heading("Request");
  cy.get("a").contains("Change a partner's name").click();
  cy.heading("Change a partner's name");
  cy.getByQA("newPartnerName").contains("Edit").click();
};

export const clearAndValidate = () => {
  cy.get("textarea").should("have.value", "Hello! I am the public description for this Cypress project. \\").clear();
  cy.wait(500);
  cy.clickOn("Save and continue");
  cy.heading("Change project scope");
  cy.get("textarea").should("have.value", "Howdy! I am the public summary for this Cypress project. \\").clear();
  cy.wait(500);
  cy.clickOn("Save and continue");
  cy.get("legend").contains("Mark as complete");
  cy.clickCheckBox("I agree with this change");
  cy.submitButton("Save and return to request").click();
  cy.validationLink("Enter project summary");
  cy.validationLink("Enter public description");
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
  cy.clickOn("Save and continue");
  cy.validationLink("Enter project suspension start date.");
  cy.validationLink("Enter project suspension end date.");
  cy.paragraph("Enter project suspension start date.");
  cy.paragraph("Enter project suspension end date.");
  cy.wait(500);
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("200");
  });
  cy.clickOn("Save and continue");
  cy.validationLink("Enter project suspension start date.");
  cy.validationLink("Enter project suspension end date.");
  cy.paragraph("Enter project suspension start date.");
  cy.paragraph("Enter project suspension end date.");
  cy.wait(500);
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("-200");
  });
  cy.clickOn("Save and continue");
  cy.validationLink("Enter project suspension start date.");
  cy.validationLink("Enter project suspension end date.");
  cy.paragraph("Enter project suspension start date.");
  cy.paragraph("Enter project suspension end date.");
  cy.wait(500);
  [
    "#suspensionStartDate_month",
    "#suspensionStartDate_year",
    "#suspensionEndDate_month",
    "#suspensionEndDate_year",
  ].forEach(input => {
    cy.get(input).clear().type("%^&*");
  });
  cy.clickOn("Save and continue");
  cy.validationLink("Enter project suspension start date.");
  cy.validationLink("Enter project suspension end date.");
  cy.paragraph("Enter project suspension start date.");
  cy.paragraph("Enter project suspension end date.");
};

export const validateGrantMoving = () => {
  cy.get("input#grantMovingOverFinancialYear").type("Error");
  cy.get("legend").contains("Mark as complete");
  cy.clickCheckBox("I agree with this change");
  cy.submitButton("Save and return to request").click();
  cy.validationLink("Enter grant moving over financial year.");
  cy.paragraph("Enter grant moving over financial year.");
  cy.clickCheckBox("I agree with this change");
  cy.get("legend").contains("Grant value moving over the financial year end");
  cy.get("#grantMovingOverFinancialYear").clear().type("10000000000000000000");
  cy.clickOn("Save and return to request");
  cy.validationLink("Grant moving over financial year must be less than £999,999,999,999.00.");
  cy.paragraph("Grant moving over financial year must be less than £999,999,999,999.00.");
  cy.get("#grantMovingOverFinancialYear").clear().type("-100");
  cy.clickOn("Save and return to request");
  cy.validationLink("Grant moving over financial year cannot be less than £0.");
  cy.paragraph("Grant moving over financial year cannot be less than £0.");
  cy.get("#grantMovingOverFinancialYear").clear().type("1000.333");
  cy.clickOn("Save and return to request");
  cy.validationLink("Grant moving over financial year must be 2 decimal places or fewer.");
  cy.paragraph("Grant moving over financial year must be 2 decimal places or fewer.");
  cy.get("input#grantMovingOverFinancialYear").clear().type("0");
};

export const validatePcrDurationPage = () => {
  cy.submitButton("Submit request").click();
  cy.validationLink("Reasons entry must be complete.");
  cy.validationLink("Change project duration must be complete.");
  cy.paragraph("Reasons entry must be complete.");
  cy.paragraph("Change project duration must be complete.");
};

export enum PcrItemType {
  ReallocateProjectCosts = "Reallocate project costs",
  RemoveAPartner = "Remove a partner",
  AddAPartner = "Add a partner",
  ChangeProjectScope = "Change project scope",
  ChangeProjectDuration = "Change project duration",
  ChangeAPartnerName = "Change a partner's name",
  ApproveANewSubcontractor = "Approve a new subcontractor",
  PutAProjectOnHold = "Put project on hold",
}

const pcrArray = [
  PcrItemType.ReallocateProjectCosts,
  PcrItemType.RemoveAPartner,
  PcrItemType.AddAPartner,
  PcrItemType.ChangeProjectScope,
  PcrItemType.ChangeProjectDuration,
  PcrItemType.ChangeAPartnerName,
  PcrItemType.ApproveANewSubcontractor,
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
    cy.wait(300);
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
  cy.wait(500);
};

export const leaveCommentQuery = () => {
  cy.getByLabel("Query the request").click();
  cy.wait(500);
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
    ["1421", "Remove a partner", "27 Feb 2023", "Submitted to Monitoring Officer"],
    ["1419", "Remove a partner", "27 Feb 2023", "Queried to Project Manager"],
  ].forEach(([reqNo, types, started, status], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(1)`).contains(reqNo);
        cy.get(`td:nth-child(2)`).contains(types);
        cy.get(`td:nth-child(3)`).contains(started);
        cy.get(`td:nth-child(4)`).contains(status);
        cy.get(`td:nth-child(5)`).contains("9 Apr 2024");
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
  cy.clickOn("Save and continue");
  cy.validationLink("Enter project suspension start date.");
  cy.get("a").each($a => {
    cy.wrap($a).should("not.have.text", "The last day of pause cannot be before the first day of pause.");
  });
  cy.paragraph("Enter project suspension start date.");
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
  cy.get("td").contains("Put project on hold").siblings().contains("Review").click();
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

export const workingPreviousArrow = (name: Heading | Tile | CostCategory) => {
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
    cy.get("label").contains("Enter new name");
    cy.button("Save and continue").click();
    cy.get("legend").contains("Upload change of name certificate");
    cy.button("Save and continue").click();
    cy.get("legend").contains("Mark as complete");
  });
  cy.contains("dt", "Change of name certificate").siblings().contains("Edit").click();
  cy.heading("Change a partner's name");
  cy.get("legend").contains("Upload change of name certificate");
  cy.button("Save and continue").click();
  cy.get("legend").contains("Mark as complete");
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

export const validateCostUpdateInputs = () => {
  cy.get("a").contains("EUI Small Ent Health").click();
  cy.get("h2").contains("EUI Small Ent Health");
  cy.getByAriaLabel("Labour").clear().type("10000000000000000");
  cy.wait(500);
  cy.clickOn("Save and return to reallocate project costs");
  cy.validationLink("Eligible costs must be less than £999,999,999,999.00.");
};

export const reallocateDecimals = () => {
  [
    ["Labour", "34999.66", "-£0.34"],
    ["Overheads", "333.33", "-£34,666.67"],
    ["Materials", "35333.33", "£333.33"],
    ["Capital usage", "35000.33", "£0.33"],
  ].forEach(([aria, input, calculation], index) => {
    cy.getByAriaLabel(aria).clear().type(input);
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(5)").contains(calculation);
      });
  });
  cy.wait(500);
  ["Partner totals", "£350,000.00", "£0.00", "£315,666.65", "-£34,333.35"].forEach((total, index) => {
    cy.get("tfoot").within(() => {
      cy.get("tr").within(() => {
        cy.get(`td:nth-child(${index + 1})`).contains(total);
      });
    });
  });
  cy.clickOn("Save and return to reallocate project costs");
  cy.get("td.govuk-table__cell").contains("EUI Small Ent Health");
  cy.get("tfoot").within(() => {
    cy.get("th:nth-child(5)").contains("£540,666.65");
    cy.get("th:nth-child(6)").contains("£491,666.65");
    cy.get("th:nth-child(7)").contains("£319,583.32");
  });
};

export const updateEUICosts = () => {
  [
    ["Labour", "33998.90", "-£1,001.10"],
    ["Overheads", "32998.80", "-£2,001.20"],
    ["Materials", "31666.33", "-£3,333.67"],
    ["Capital usage", "30333.66", "-£4,666.34"],
    ["Subcontracting", "1000", "£1,000.00"],
    ["Travel and subsistence", "30000", "-£5,000.00"],
    ["Other costs", "29000", "-£6,000.00"],
    ["Other costs 2", "28000", "-£7,000.00"],
    ["Other costs 3", "27000", "-£8,000.00"],
    ["Other costs 4", "26000", "-£9,000.00"],
    ["Other costs 5", "25000", "-£10,000.00"],
  ].forEach(([aria, input, calculation], index) => {
    cy.getByAriaLabel(aria).clear().type(input);
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(5)").contains(calculation);
      });
  });
  cy.wait(500);
  ["Partner totals", "£350,000.00", "£0.00", "£294,997.69", "-£55,002.31"].forEach((total, index) => {
    cy.get("tfoot").within(() => {
      cy.get("tr").within(() => {
        cy.get(`td:nth-child(${index + 1})`).contains(total);
      });
    });
  });
  [
    "Total eligible costs",
    "New total eligible costs",
    "Difference",
    "Total remaining grant",
    "New total remaining grant",
    "Difference",
  ].forEach((head, index) => {
    cy.getByQA("summary-table").within(() => {
      cy.get("thead").within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(head);
      });
    });
  });
  ["£575,000.00", "£519,997.69", "-£55,002.31", "£341,900.00", "£306,148.50", "-£35,751.50"].forEach((total, index) => {
    cy.getByQA("summary-table").within(() => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(total);
        });
    });
  });
};

export const partnerTableWithUnderspend = () => {
  [
    [
      "EUI Small Ent Health (Lead)",
      "£350,000.00",
      "£350,000.00",
      "£227,500.00",
      "£294,997.69",
      "£294,997.69",
      "£191,748.50",
    ],
    ["A B Cad Services", "£175,000.00", "£175,000.00", "£113,750.00", "£175,000.00", "£175,000.00", "£113,750.00"],
    ["ABS EUI Medium Enterprise", "£50,000.00", "£1,000.00", "£650.00", "£50,000.00", "£1,000.00", "£650.00"],
  ].forEach(
    ([partner, totalEl, remainingCosts, remainingGrant, newTotalEl, newRemainingCosts, newRemainingGrant], index) => {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get(`td:nth-child(1)`).contains(partner);
          cy.get(`td:nth-child(2)`).contains(totalEl);
          cy.get(`td:nth-child(3)`).contains(remainingCosts);
          cy.get(`td:nth-child(4)`).contains(remainingGrant);
          cy.get(`td:nth-child(5)`).contains(newTotalEl);
          cy.get(`td:nth-child(6)`).contains(newRemainingCosts);
          cy.get(`td:nth-child(7)`).contains(newRemainingGrant);
        });
    },
  );
};

export const updateABCad = () => {
  cy.get("a").contains("A B Cad Services").click();
  cy.get("h2").contains("A B Cad Services");
  [
    ["Labour", "18500", "£1,000.00"],
    ["Overheads", "19500", "£2,000.00"],
    ["Materials", "20500", "£3,000.00"],
    ["Capital usage", "21500", "£4,000.00"],
    ["Subcontracting", "19500", "£2,000.00"],
    ["Travel and subsistence", "22500", "£5,000.00"],
    ["Other costs", "23500", "£6,000.00"],
    ["Other costs 2", "24500", "£7,000.00"],
    ["Other costs 3", "25500", "£8,000.00"],
    ["Other costs 4", "26500", "£9,000.00"],
    ["Other costs 5", "10000", "£10,000.00"],
  ].forEach(([aria, input, calculation], index) => {
    cy.getByAriaLabel(aria).clear().type(input);
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(5)").contains(calculation);
      });
  });
  cy.wait(500);
  ["Partner totals", "£175,000.00", "£0.00", "£232,000.00", "£57,000.00"].forEach((total, index) => {
    cy.get("tfoot").within(() => {
      cy.get("tr").within(() => {
        cy.get(`td:nth-child(${index + 1})`).contains(total);
      });
    });
  });
  [
    "Total eligible costs",
    "New total eligible costs",
    "Difference",
    "Total remaining grant",
    "New total remaining grant",
    "Difference",
  ].forEach((head, index) => {
    cy.getByQA("summary-table").within(() => {
      cy.get("thead").within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(head);
      });
    });
  });
  ["£575,000.00", "£576,997.69", "£1,997.69", "£341,900.00", "£343,198.50", "£1,298.50"].forEach((total, index) => {
    cy.getByQA("summary-table").within(() => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(total);
        });
    });
  });
};

export const partnerTableWithOverspend = () => {
  [
    [
      "EUI Small Ent Health (Lead)",
      "£350,000.00",
      "£350,000.00",
      "£227,500.00",
      "£294,997.69",
      "£294,997.69",
      "£191,748.50",
    ],
    ["A B Cad Services", "£175,000.00", "£175,000.00", "£113,750.00", "£232,000.00", "£232,000.00", "£150,800.00"],
    ["ABS EUI Medium Enterprise", "£50,000.00", "£1,000.00", "£650.00", "£50,000.00", "£1,000.00", "£650.00"],
  ].forEach(
    ([partner, totalEl, remainingCosts, remainingGrant, newTotalEl, newRemainingCosts, newRemainingGrant], index) => {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get(`td:nth-child(1)`).contains(partner);
          cy.get(`td:nth-child(2)`).contains(totalEl);
          cy.get(`td:nth-child(3)`).contains(remainingCosts);
          cy.get(`td:nth-child(4)`).contains(remainingGrant);
          cy.get(`td:nth-child(5)`).contains(newTotalEl);
          cy.get(`td:nth-child(6)`).contains(newRemainingCosts);
          cy.get(`td:nth-child(7)`).contains(newRemainingGrant);
        });
    },
  );
};

export const reaccessABCadReduce = () => {
  cy.get("a").contains("A B Cad Services").click();
  cy.get("h2").contains("A B Cad Services");
  cy.getByAriaLabel("Other costs 5").clear().type("7000");
  cy.wait(500);
  cy.button("Save and return to reallocate project costs").click();
  cy.heading("Reallocate project costs");
};

export const changeRemainingGrantPage = () => {
  [
    "You can only use this page to change the 'New remaining grant' for partners who can have different funding level percentages.",
    "Check the funding rules to ensure each partner's funding level does not exceed their allowable limit.",
    "You can change the 'New remaining grant' for any partner to ensure the total 'New remaining grant' does not exceed the total 'Remaining grant'.",
    "Each partner's 'Funding level' will be updated to the 'New funding level' for the remaining project costs.",
  ].forEach(copy => {
    cy.paragraph(copy);
  });

  [
    "Partner",
    "Remaining costs",
    "Remaining grant",
    "Funding level",
    "New remaining costs",
    "New remaining grant",
    "New funding level",
  ].forEach(header => {
    cy.tableHeader(header);
  });
  [
    ["EUI Small Ent Health", "£350,000.00", "£227,500.00", "65.00%", "£294,997.69"],
    ["A B Cad Services", "£175,000.00", "£113,750.00", "65.00%", "£229,000.00"],
    ["ABS EUI Medium Enterprise", "£1,000.00", "£650.00", "65.00%", "£1,000.00"],
  ].forEach(([partner, remainingCosts, remainingGrant, fundingLevel, newRemainingCosts], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(partner);
        cy.get("td:nth-child(2)").contains(remainingCosts);
        cy.get("td:nth-child(3)").contains(remainingGrant);
        cy.get("td:nth-child(4)").contains(fundingLevel);
        cy.get("td:nth-child(5)").contains(newRemainingCosts);
      });
  });
  ["Project totals", "£526,000.00", "£341,900.00", "65.00%", "£524,997.69", "£341,248.50", "65.00%"].forEach(
    (footer, index) => {
      cy.get("tfoot").within(() => {
        cy.get("tr").within(() => {
          cy.get(`th:nth-child(${index + 1})`).contains(footer);
        });
      });
    },
  );
};

export const updateNewRemainingGrant = () => {
  [
    ["EUI Small Ent Health new remaining grant", "191748.50", "200000", "67.80%", "£349,500.00", "66.57%"],
    ["A B Cad Services new remaining grant", "148850", "150000", "65.50%", "£350,650.00", "66.79%"],
    ["ABS EUI Medium Enterprise new remaining grant", "650", "700", "70.00%", "£350,700.00", "66.80%"],
  ].forEach(([aria, value, input, rowPercentage, totalGrant, totalPercentage], index) => {
    cy.getByAriaLabel(aria).should("have.value", Number(value)).clear().type(input);
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get(`td:nth-child(7)`).contains(rowPercentage);
      });
    cy.get("tfoot").within(() => {
      cy.get("tr").within(() => {
        cy.get("th:nth-child(6)").contains(totalGrant);
        cy.get("th:nth-child(7)").contains(totalPercentage);
      });
    });
  });
};

export const reduceNewRemainingGrant = () => {
  [
    ["1", "EUI Small Ent Health new remaining grant", "192399", "65.22%", "£343,099.00", "65.35%"],
    ["2", "A B Cad Services new remaining grant", "148849", "65.00%", "£341,948.00", "65.13%"],
    ["1", "EUI Small Ent Health new remaining grant", "192399.01", "65.22%", "£341,948.01", "65.13%"],
    ["2", "A B Cad Services new remaining grant", "148848.99", "65.00%", "£341,948.00", "65.13%"],
    ["3", "ABS EUI Medium Enterprise new remaining grant", "649", "64.90%", "£341,897.00", "65.12%"],
  ].forEach(([row, aria, input, rowPercentage, totalGrant, totalPercentage]) => {
    cy.getByAriaLabel(aria).clear().type(input);
    cy.get("tr")
      .eq(Number(row))
      .within(() => {
        cy.get(`td:nth-child(7)`).contains(rowPercentage);
      });
    cy.get("tfoot").within(() => {
      cy.get("tr").within(() => {
        cy.get("th:nth-child(6)").contains(totalGrant);
        cy.get("th:nth-child(7)").contains(totalPercentage);
      });
    });
  });
  cy.getByQA("validation-summary").should("not.exist");
};

export const saveReflectSurplus = () => {
  cy.clickOn("Save and return to reallocate project costs");
  cy.heading("Reallocate project costs");
  ["£192,399.01", "£148,848.99", "£649.00"].forEach((newRemGrant, index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(7)").contains(newRemGrant);
      });
  });
  cy.get("tfoot").within(() => {
    cy.get("tr").within(() => {
      cy.get("th:nth-child(7)").contains("£341,897.00");
    });
  });
};

export const negativeGrantChange = () => {
  cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type("-1000");
  cy.button("Save and return to reallocate project costs").click();
  cy.validationLink("Grant cannot be less than zero.");
};

export const validateAlphaCharacters = () => {
  cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type("lorem");
  cy.button("Save and return to reallocate project costs").click();
  cy.validationLink("New remaining grant must be a valid currency value.");
  cy.paragraph("New remaining grant must be a valid currency value.");
};

export const saveZeroValue = () => {
  cy.clickOn("Change remaining grant");
  cy.heading("Change remaining grant");
  cy.getByAriaLabel("ABS EUI Medium Enterprise new remaining grant").clear().type("0");
  cy.wait(300);
  cy.clickOn("Save and return to reallocate project costs");
  cy.heading("Reallocate project costs");
  cy.get("tr")
    .eq(3)
    .within(() => {
      cy.get("td:nth-child(1)").contains("ABS EUI Medium Enterprise");
      cy.get("td:nth-child(7)").contains("£0.00");
    });
};

export const restoreRemainingGrant = () => {
  cy.clickOn("Change remaining grant");
  cy.heading("Change remaining grant");
  cy.getByAriaLabel("ABS EUI Medium Enterprise new remaining grant").clear().type("652");
  cy.wait(300);
  cy.clickOn("Save and return to reallocate project costs");
  cy.heading("Reallocate project costs");
  cy.getByQA("validation-message-content").should("not.exist");
};

export const increaseSinglePartnerOver100 = () => {
  cy.clickOn("Change remaining grant");
  cy.heading("Change remaining grant");
  cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type("0");
  cy.getByAriaLabel("A B Cad Services new remaining grant").clear().type("229020");
  cy.get("tr")
    .eq(2)
    .within(() => {
      cy.get("td:nth-child(7)").contains("100.01%");
    });
  cy.button("Save and return to reallocate project costs").click();
  cy.validationLink("The grant cannot exceed the remaining grant for any individual partner");
  cy.paragraph("The grant cannot exceed the remaining grant for any individual partner");
};

export const revertToPreviousValues = () => {
  [
    ["EUI Small Ent Health new remaining grant", "192399.01"],
    ["A B Cad Services new remaining grant", "148848.99"],
  ].forEach(([input, value]) => {
    cy.getByAriaLabel(input).clear().type(value);
  });
  cy.clickOn("Save and return to reallocate project costs");
  cy.heading("Reallocate project costs");
};

export const changeRemainingGrantRounding = () => {
  [
    ["EUI Small Ent Health new remaining grant", "192399.33", "65.22%"],
    ["A B Cad Services new remaining grant", "148848.67", "65.00%"],
  ].forEach(([input, value, percentage], index) => {
    cy.getByAriaLabel(input).clear().type(value);
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(7)").contains(percentage);
      });
  });
  cy.get("tfoot").within(() => {
    cy.get("tr").within(() => {
      cy.get("th:nth-child(6)").contains("£341,900.00");
      cy.get("th:nth-child(7)").contains("65.12%");
    });
  });
  cy.clickOn("Save and return to reallocate project costs");
  cy.heading("Reallocate project costs");
  cy.get("tfoot").within(() => {
    cy.get("tr").within(() => {
      cy.get("th:nth-child(7)").contains("£341,900.00");
    });
  });
  cy.clickOn("Change remaining grant");
  cy.heading("Change remaining grant");
  [
    ["EUI Small Ent Health new remaining grant", "192399.22", "65.22%"],
    ["A B Cad Services new remaining grant", "148848.78", "65.00%"],
  ].forEach(([input, value, percentage], index) => {
    cy.getByAriaLabel(input).clear().type(value);
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(7)").contains(percentage);
      });
  });
  cy.get("tfoot").within(() => {
    cy.get("tr").within(() => {
      cy.get("th:nth-child(6)").contains("£341,900.00");
      cy.get("th:nth-child(7)").contains("65.12%");
    });
  });
  cy.clickOn("Save and return to reallocate project costs");
  cy.heading("Reallocate project costs");
  cy.get("tfoot").within(() => {
    cy.get("tr").within(() => {
      cy.get("th:nth-child(7)").contains("£341,900.00");
    });
  });
};

export const displayUpliftInProgress = () => {
  cy.contains("td", "Uplift")
    .parent()
    .within(() => {
      ["183", "Uplift", uploadDate, "In Progress", uploadDate, "View"].forEach((td, index) => {
        cy.get(`td:nth-child(${index + 1})`).contains(td);
      });
    });
};

export const clickViewLoadUplift = () => {
  cy.contains("td", "Uplift")
    .parent()
    .within(() => {
      ["183", "Uplift", uploadDate, "In Progress", uploadDate, "View"].forEach((td, index) => {
        cy.get(`td:nth-child(${index + 1})`).contains(td);
      });
      cy.get("td:nth-child(6)").contains("View").click();
    });
};

export const upliftListItems = () => {
  [
    ["Request number", "183"],
    ["Type", "Uplift"],
    ["Justification", 'This is the override justification and should be visible. *!"£$%^&()/`@#~<>,.'],
  ].forEach(([key, list]) => {
    cy.getListItemFromKey(key, list);
  });
  cy.get("dt").should("not.have.text", "Files");
  cy.get("dd").should("not.have.text", "documentUploadedByIUK.docx");
};

export const upliftPartnerTable = () => {
  [
    "Partner",
    "Total eligible costs",
    "New total eligible costs",
    "Difference",
    "Funding level",
    "New funding level",
    "Remaining grant",
    "New remaining grant",
    "Difference",
  ].forEach((header, index) => {
    cy.get("tr")
      .eq(0)
      .within(() => {
        cy.get(`th:nth-child(${index + 1})`).contains(header);
      });
  });
  [
    [
      "EUI Small Ent Health (Lead)",
      "£384,000.00",
      "£384,666.33",
      "£666.33",
      "65.00%",
      "65.00%",
      "£247,650.00",
      "£248,083.11",
      "£433.11",
    ],
    [
      "A B Cad Services",
      "£386,000.00",
      "£386,666.33",
      "£666.33",
      "66.00%",
      "66.00%",
      "£254,760.00",
      "£255,199.78",
      "£439.78",
    ],
    [
      "ABS EUI Medium Enterprise",
      "£385,000.00",
      "£385,666.33",
      "£666.33",
      "67.00%",
      "67.00%",
      "£257,950.00",
      "£258,396.44",
      "£446.44",
    ],
    [
      "Auto Corporation Ltd",
      "£381,000.00",
      "£381,666.66",
      "£666.66",
      "68.00%",
      "68.00%",
      "£259,080.00",
      "£259,533.33",
      "£453.33",
    ],
    [
      "Auto Healthcare Ltd",
      "£387,220.00",
      "£387,886.66",
      "£666.66",
      "69.00%",
      "69.00%",
      "£267,181.80",
      "£267,641.80",
      "£460.00",
    ],
    ["Auto Monitoring Ltd", "£420,000.00", "£420,666.66", "£666.66", "70.00%", "70.00%", "£0.00", "£466.66", "£466.66"],
    [
      "Auto Research Ltd",
      "£388,000.00",
      "£388,666.33",
      "£666.33",
      "71.00%",
      "71.00%",
      "£275,480.00",
      "£275,953.09",
      "£473.09",
    ],
    ["Brown and co", "£35,000.00", "£35,666.66", "£666.66", "72.00%", "72.00%", "£25,200.00", "£25,680.00", "£480.00"],
    [
      "Deep Rock Galactic",
      "£390,000.00",
      "£390,333.33",
      "£333.33",
      "73.00%",
      "73.00%",
      "£284,700.00",
      "£284,943.33",
      "£243.33",
    ],
    [
      "EUI Micro Research Co.",
      "£416,000.00",
      "£416,666.66",
      "£666.66",
      "74.00%",
      "74.00%",
      "-£2,960.00",
      "-£2,466.67",
      "£493.33",
    ],
    [
      "Gorcium Management Services Ltd.",
      "£389,000.00",
      "£389,666.66",
      "£666.66",
      "75.00%",
      "75.00%",
      "£291,750.00",
      "£292,250.00",
      "£500.00",
    ],
    [
      "Hedges' Hedges Ltd",
      "£414,000.00",
      "£414,666.66",
      "£666.66",
      "76.00%",
      "76.00%",
      "£314,640.00",
      "£315,146.66",
      "£506.66",
    ],
    [
      "Hyperion Corporation",
      "£400,000.00",
      "£400,333.33",
      "£333.33",
      "77.00%",
      "77.00%",
      "£308,000.00",
      "£308,256.66",
      "£256.66",
    ],
    [
      "Image Development Society",
      "£267,160.50",
      "£267,827.16",
      "£666.66",
      "78.00%",
      "78.00%",
      "£208,385.19",
      "£208,905.18",
      "£519.99",
    ],
    [
      "Intaser",
      "£1,010,000.00",
      "£1,010,666.66",
      "£666.66",
      "79.00%",
      "79.00%",
      "£797,900.00",
      "£798,426.66",
      "£526.66",
    ],
    ["Jakobs", "£372,000.00", "£372,333.33", "£333.33", "80.00%", "80.00%", "£297,600.00", "£297,866.66", "£266.66"],
    [
      "Java Coffee Inc",
      "£550,000.00",
      "£550,333.33",
      "£333.33",
      "81.00%",
      "81.00%",
      "£445,500.00",
      "£445,770.00",
      "£270.00",
    ],
    [
      "Lutor Systems",
      "£396,000.00",
      "£396,333.33",
      "£333.33",
      "82.00%",
      "82.00%",
      "-£19,680.00",
      "-£19,406.67",
      "£273.33",
    ],
    ["Maliwan", "£355,000.00", "£355,333.33", "£333.33", "83.00%", "83.00%", "£294,650.00", "£294,926.66", "£276.66"],
    ["Munce Inc", "£450,000.00", "£450,333.33", "£333.33", "84.00%", "84.00%", "£378,000.00", "£378,280.00", "£280.00"],
    [
      "National Investment Bank",
      "£440,000.00",
      "£440,333.33",
      "£333.33",
      "85.00%",
      "85.00%",
      "£374,000.00",
      "£374,283.33",
      "£283.33",
    ],
    [
      "NIB Reasearch Limited",
      "£385,000.00",
      "£385,333.33",
      "£333.33",
      "86.00%",
      "86.00%",
      "£331,100.00",
      "£331,386.66",
      "£286.66",
    ],
    [
      "RBA Test Account 1",
      "£404,000.00",
      "£404,666.33",
      "£666.33",
      "87.00%",
      "87.00%",
      "£351,480.00",
      "£352,059.71",
      "£579.71",
    ],
    [
      "Red Motor Research Ltd.",
      "£416,000.00",
      "£416,333.33",
      "£333.33",
      "88.00%",
      "88.00%",
      "-£3,520.00",
      "-£3,226.67",
      "£293.33",
    ],
    [
      "Swindon Development University",
      "£420,000.00",
      "£420,666.66",
      "£666.66",
      "89.00%",
      "89.00%",
      "£373,800.00",
      "£374,393.33",
      "£593.33",
    ],
    [
      "Swindon University",
      "£413,000.00",
      "£413,333.33",
      "£333.33",
      "90.00%",
      "90.00%",
      "-£6,300.00",
      "-£6,000.00",
      "£300.00",
    ],
    [
      "The Best Manufacturing",
      "£360,000.00",
      "£360,333.33",
      "£333.33",
      "91.00%",
      "91.00%",
      "£327,600.00",
      "£327,903.33",
      "£303.33",
    ],
    [
      "Top Castle Co.",
      "£470,000.00",
      "£470,333.33",
      "£333.33",
      "92.00%",
      "92.00%",
      "£46,000.00",
      "£46,306.66",
      "£306.66",
    ],
    ["UAT37", "£485,000.00", "£485,666.33", "£666.33", "93.00%", "93.00%", "£451,050.00", "£451,669.69", "£619.69"],
    [
      "University of Bristol",
      "£429,000.00",
      "£429,333.33",
      "£333.33",
      "94.00%",
      "94.00%",
      "£8,460.00",
      "£8,773.33",
      "£313.33",
    ],
    [
      "Vitruvius Stonework Limited",
      "£389,000.00",
      "£389,666.66",
      "£666.66",
      "95.00%",
      "95.00%",
      "£369,550.00",
      "£370,183.33",
      "£633.33",
    ],
    ["YHDHDL", "£735,000.00", "£735,666.66", "£666.66", "96.11%", "96.11%", "£706,408.50", "£707,049.23", "£640.73"],
  ].forEach(
    (
      [
        partner,
        totalEligible,
        difference,
        newEligible,
        fundingLevel,
        newFundingLevel,
        remainingGrant,
        newRemainingGrant,
        totalDifference,
      ],
      index,
    ) => {
      cy.get("tr")
        .eq(index + 1)
        .within(() => {
          cy.get("td:nth-child(1)").contains(partner);
          cy.get("td:nth-child(2)").contains(totalEligible);
          cy.get("td:nth-child(3)").contains(difference);
          cy.get("td:nth-child(4)").contains(newEligible);
          cy.get("td:nth-child(5)").contains(fundingLevel);
          cy.get("td:nth-child(6)").contains(newFundingLevel);
          cy.get("td:nth-child(7)").contains(remainingGrant);
          cy.get("td:nth-child(8)").contains(newRemainingGrant);
          cy.get("td:nth-child(9)").contains(totalDifference);
        });
    },
  );
  [
    "Project totals",
    "£13,521,380.50",
    "£13,538,045.02",
    "£16,664.52",
    "80.50%",
    "80.50%",
    "£8,515,415.49",
    "£8,528,634.61",
    "£13,219.12",
  ].forEach((footer, index) => {
    cy.get("tfoot").within(() => {
      cy.get(`th:nth-child(${index + 1})`).contains(footer);
    });
  });
};

export const clickIntoPartnerTable = (partner: string) => {
  cy.get("a").contains(partner).click();
  cy.get("h2").contains(partner);
};

export const validateEuiSmallEntUplift = () => {
  ["Cost category", "Total eligible costs", "New total eligible costs", "Costs reallocated"].forEach(
    (header, index) => {
      cy.get("tr")
        .eq(0)
        .within(() => {
          cy.get(`th:nth-child(${index + 1})`).contains(header);
        });
    },
  );
  [
    ["Labour", "£35,000.00", "£35,666.33", "£666.33"],
    ["Overheads", "£35,000.00", "£35,000.00", "£0.00"],
    ["Materials", "£35,000.00", "£35,000.00", "£0.00"],
    ["Capital usage", "£35,000.00", "£35,000.00", "£0.00"],
    ["Subcontracting", "£34,000.00", "£34,000.00", "£0.00"],
    ["Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 2", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 3", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 4", "£35,000.00", "£35,000.00", "£0.00"],
    ["Other costs 5", "£35,000.00", "£35,000.00", "£0.00"],
  ].forEach(([category, totalEligible, newEligible, costsReallocated], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(category);
        cy.get("td:nth-child(2)").contains(totalEligible);
        cy.get("td:nth-child(3)").contains(newEligible);
        cy.get("td:nth-child(4)").contains(costsReallocated);
      });
  });
  ["Partner totals", "£384,000.00", "£384,666.33", "£666.33"].forEach((footer, index) => {
    cy.get("tfoot").within(() => {
      cy.get(`td:nth-child(${index + 1})`).contains(footer);
    });
  });
};

export const validateSwindonDevUni = () => {
  ["Cost category", "Total eligible costs", "New total eligible costs", "Costs reallocated"].forEach(
    (header, index) => {
      cy.get("tr")
        .eq(0)
        .within(() => {
          cy.get(`th:nth-child(${index + 1})`).contains(header);
        });
    },
  );
  [
    ["Directly incurred - Staff", "£35,000.00", "£35,666.66", "£666.66"],
    ["Directly incurred - Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
    ["Directly incurred - Equipment", "£35,000.00", "£35,000.00", "£0.00"],
    ["Directly incurred - Other costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Directly allocated - Investigations", "£35,000.00", "£35,000.00", "£0.00"],
    ["Directly allocated - Estates costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Directly allocated - Other costs", "£35,000.00", "£35,000.00", "£0.00"],
    ["Indirect costs - Investigations", "£35,000.00", "£35,000.00", "£0.00"],
    ["Exceptions - Staff", "£35,000.00", "£35,000.00", "£0.00"],
    ["Exceptions - Travel and subsistence", "£35,000.00", "£35,000.00", "£0.00"],
    ["Exceptions - Equipment", "£35,000.00", "£35,000.00", "£0.00"],
    ["Exceptions - Other costs", "£35,000.00", "£35,000.00", "£0.00"],
  ].forEach(([category, totalEligible, newEligible, costsReallocated], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(category);
        cy.get("td:nth-child(2)").contains(totalEligible);
        cy.get("td:nth-child(3)").contains(newEligible);
        cy.get("td:nth-child(4)").contains(costsReallocated);
      });
  });
  ["Partner totals", "£420,000.00", "£420,666.66", "£666.66"].forEach((footer, index) => {
    cy.get("tfoot").within(() => {
      cy.get(`td:nth-child(${index + 1})`).contains(footer);
    });
  });
};
