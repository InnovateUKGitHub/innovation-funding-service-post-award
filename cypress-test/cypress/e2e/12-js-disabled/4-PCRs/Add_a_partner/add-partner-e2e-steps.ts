import {
  loremIpsum255Char,
  loremIpsum50Char,
  loremIpsum51Char,
  loremIpsum40Char,
  loremIpsum20Char,
  loremIpsum21Char,
  loremIpsum10Char,
  loremIpsum256Char,
} from "common/lorem";
import { testFile } from "common/testfileNames";
import { PcrItemType } from "../steps";
let newCurrency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
const uploadDate = new Date().getFullYear().toString();

export const navigateToCostCat = (category: string, row: number) => {
  cy.wait(500);
  cy.get("tr")
    .eq(row)
    .within(() => {
      cy.get("td:nth-child(3)").contains("Edit").click();
    });
  cy.get("h2").contains(category);
};

export const attemptToPromptValidation = () => {
  cy.clickOn("Submit request");
  cy.validationLink("Reasons entry must be complete.");
  cy.validationLink("Add a partner must be complete.");
  cy.paragraph("Add a partner must be complete.");
  cy.paragraph("Reasons entry must be complete.");
};

export const addPartnerContinue = () => {
  cy.getByQA("WhatDoYouWantToDo").within(() => {
    cy.get("a").contains("Add a partner").click();
  });
  cy.heading("Add a partner");
};

export const saveAndSummary = () => {
  cy.clickOn("Save and return to summary");
  cy.validationLink("Select project role.");
  cy.validationLink("Select partner type.");
  cy.paragraph("Select project role.");
  cy.paragraph("Select partner type.");
};

export const theDifferentTypes = () => {
  cy.get("span").contains("What are the different types?").click();
  [
    "Business",
    " - a business based in the UK or overseas.",
    "Research",
    " - higher education and organisations registered with Je-S.",
    "Research and technology organisation (RTO)",
    " - organisations which solely promote and conduct collaborative research and innovation.",
    "Public sector, charity or non Je-S registered research organisation",
    " - a not-for-profit public sector body or charity working on innovation, not registered with Je-S.",
  ].forEach(type => {
    cy.paragraph(type);
  });
};

export const projectRoleRadio = () => {
  ["Collaborator", "Project Lead"].forEach(radio => {
    cy.getByLabel(radio).click();
  });
};

export const partnerRadioValidation = () => {
  cy.validationLink("Select partner type.");
  cy.paragraph("Select partner type.");
  [
    "Business",
    "Research",
    "Research and Technology Organisation (RTO)",
    "Public Sector, charity or non Je-S registered research organisation",
  ].forEach(radio => {
    cy.getByLabel(radio).click();
  });
};

export const collaboratorAndBusiness = () => {
  ["Collaborator", "Business"].forEach(radio => {
    cy.getByLabel(radio).click();
  });
  cy.clickOn("Save and return to summary");
};

export const leadAndResearch = () => {
  ["Project Lead", "Research"].forEach(radio => {
    cy.getByLabel(radio).click();
  });
  cy.clickOn("Save and return to summary");
};

export const summaryWithSubs = () => {
  cy.heading("Add a partner");
  ["Organisation", "Contacts", "Funding", "Agreement"].forEach(subheading => {
    cy.get("h2").contains(subheading);
  });
  cy.get("legend").contains("Mark as complete");
  cy.get("h3").contains("Finance contact");
};

export const saveAndReturnPromptingValidation = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter organisation name.",
    "Enter registered address.",
    "Enter registration number.",
    "Enter financial year end.",
    "Enter financial year end turnover.",
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Select project location.",
    "Enter project city.",
    "Select participant size.",
    "Enter number of employees.",
    "Enter funding level.",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  [
    "Organisation name",
    "Registration number",
    "Registered address",
    "Size",
    "Number of full time employees",
    "End of financial year",
    "Turnover",
    "Project location",
    "Name of town or city",
    "First name",
    "Last name",
    "Phone number",
    "Email",
    "Funding level",
  ].forEach(section => {
    cy.get(".summary-list__row--error").contains(section);
  });
};

export const saveJeSReturnPromptingValidation = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter organisation name.",
    "Enter finance contact name.",
    "Enter finance contact surname.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Enter project manager first name.",
    "Enter project manager last name.",
    "Enter project manager phone number.",
    "Enter project manager email address.",
    "Select project location.",
    "Enter project city.",
    "Enter funding level.",
    "Enter TSB reference",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  [
    "Organisation name",
    "First name",
    "Last name",
    "Phone number",
    "Email",
    "Project location",
    "Name of town or city",
    "Funding level",
    "TSB reference",
  ].forEach(section => {
    cy.get(".summary-list__row--error").contains(section);
  });
};

export const validateWithoutOrganisation = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter financial year end.",
    "Enter financial year end turnover.",
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Select project location.",
    "Enter project city.",
    "Select participant size.",
    "Enter number of employees.",
    "Enter funding level.",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  ["Enter organisation name.", "Enter registered address.", "Enter registration number."].forEach(completed => {
    cy.validationLink(completed).should("not.exist");
  });
};

export const jeSValidationNoOrganisation = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Enter project manager first name.",
    "Enter project manager last name.",
    "Enter project manager phone number.",
    "Enter project manager email address.",
    "Enter funding level.",
    "Enter TSB reference",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  ["First name", "Last name", "Phone number", "Email", "Funding level", "TSB reference"].forEach(section => {
    cy.get(".summary-list__row--error").contains(section);
  });
};

export const jeSValidationNoLocation = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Enter project manager first name.",
    "Enter project manager last name.",
    "Enter project manager phone number.",
    "Enter project manager email address.",
    "Enter funding level.",
    "Enter TSB reference",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  ["First name", "Last name", "Phone number", "Email", "Funding level", "TSB reference"].forEach(section => {
    cy.get(".summary-list__row--error").contains(section);
  });
};

export const jeSValidationNoFCName = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter project manager first name.",
    "Enter project manager last name.",
    "Enter project manager phone number.",
    "Enter project manager email address.",
    "Enter funding level.",
    "Enter TSB reference",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  ["First name", "Last name", "Phone number", "Email", "Funding level", "TSB reference"].forEach(section => {
    cy.get(".summary-list__row--error").contains(section);
  });
};

export const jeSValidationNoPMName = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  ["Enter funding level.", "Enter TSB reference"].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  ["Funding level", "TSB reference"].forEach(section => {
    cy.get(".summary-list__row--error").contains(section);
  });
};

export const validateSizeInput = () => {
  ["-1", "a", "&*£"].forEach(input => {
    cy.get("#numberOfEmployees").clear().type(input);
    cy.wait(200);
    cy.clickOn("Save and return to summary");
    cy.validationLink("Enter a valid number of employees.");
  });
};
export const medium100Employees = () => {
  cy.getByLabel("Medium").click();
  cy.get("#numberOfEmployees").clear().type("100");
  cy.wait(200);
  cy.clickOn("Save and return to summary");
  cy.get("dt").contains("Project role");
};

export const validateWithoutSize = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter financial year end.",
    "Enter financial year end turnover.",
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Select project location.",
    "Enter project city.",
    "Enter funding level.",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  [
    "Enter organisation name",
    "Enter registered address",
    "Enter registration number",
    "Select participant size",
    "Enter number of employees",
  ].forEach(completed => {
    cy.validationLink(completed).should("not.exist");
  });
};

export const validateMonthYearInput = () => {
  ["Month", "Year"].forEach(date => {
    cy.getByLabel(date);
  });
  ["£", "test", "9999", "-1", "-2022", "0"].forEach(input => {
    cy.getByLabel("Month").clear().type(input);
    cy.getByLabel("Year").clear().type(input);
    cy.clickOn("Save and return to summary");
    cy.validationLink("Enter financial year end.");
    cy.paragraph("Enter financial year end.");
  });
};

export const validateTurnoverInput = () => {
  ["99999999999999999999999999", "1000000000000", "1000000000001", "9000000000001"].forEach(input => {
    cy.get("#financialYearEndTurnover").clear().type(input);
    cy.inputPrefix("£", 1);
    cy.clickOn("Save and return to summary");
    cy.validationLink("Financial year end turnover must be £999,999,999,999.00 or less.");
    cy.paragraph("Financial year end turnover must be £999,999,999,999.00 or less.");
  });
  ["test copy", "%^()!"].forEach(input => {
    cy.get("#financialYearEndTurnover").clear().type(input);
    cy.clickOn("Save and return to summary");
    cy.validationLink("Financial year end turnover must be a number.");
    cy.paragraph("Financial year end turnover must be a number.");
  });
  cy.get("#financialYearEndTurnover").clear().type("-1");
  cy.clickOn("Save and return to summary");
  cy.validationLink("Financial year end turnover must be £0.00 or more.");
  cy.paragraph("Financial year end turnover must be £0.00 or more.");
  cy.get("#financialYearEndTurnover").clear().type("$");
  cy.clickOn("Save and return to summary");
  cy.validationLink("Financial year end turnover must be in pounds (£).");
  cy.paragraph("Financial year end turnover must be in pounds (£).");
};

export const completeDateAndTurnover = () => {
  cy.getByLabel("Month").clear().type("03");
  cy.wait(200);
  cy.getByLabel("Year").clear().type("2024");
  cy.wait(200);
  cy.get("#financialYearEndTurnover").clear().type("300000");
  cy.wait(200);
  cy.clickOn("Save and return to summary");
  cy.get("dt").contains("Project role");
};

export const validateWithoutFY = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Select project location.",
    "Enter project city.",
    "Enter funding level.",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  [
    "Enter organisation name.",
    "Enter registered address.",
    "Enter registration number.",
    "Select participant size.",
    "Enter number of employees.",
    "Enter financial year end.",
    "Enter financial year end turnover.",
  ].forEach(completed => {
    cy.getByQA("validation-summary").should("not.contain", completed);
  });
};

export const validateNameOfTown = () => {
  cy.get("#project-city").clear().invoke("val", loremIpsum40Char).trigger("input");
  cy.get("#project-city").type("{moveToEnd}").type("t");
  cy.clickOn("Save and return to summary");
  cy.validationLink("Project city must be 40 characters or less.");
  cy.paragraph("Project city must be 40 characters or less.");
  cy.get("#project-city").type("{moveToEnd}{backspace}");
};

export const validatePostcodeInput = () => {
  cy.get("#project-postcode").clear().invoke("val", loremIpsum10Char).trigger("input");
  cy.get("#project-postcode").type("{moveToEnd}").type("t");
  cy.clickOn("Save and return to summary");
  cy.validationLink("Project postcode must be 10 characters or less.");
  cy.paragraph("Project postcode must be 10 characters or less.");
  cy.get("#project-postcode").type("{moveToEnd}{backspace}");
};

export const completeLocationForm = () => {
  cy.getByLabel("Inside the United Kingdom").click();
  cy.get("#project-city").clear().type("Swindon");
  cy.get("#project-postcode").clear().type("SN5 1LT");
  cy.clickOn("Save and return to summary");
  cy.get("dt").contains("Project role");
};

export const validateWithoutLocation = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  [
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
    "Enter funding level.",
  ].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  [
    "Enter organisation name.",
    "Enter registered address.",
    "Enter registration number.",
    "Select participant size.",
    "Enter number of employees.",
    "Enter financial year end.",
    "Enter financial year end turnover.",
    "Select project location.",
    "Enter project city.",
    "Enter project postcode",
  ].forEach(completed => {
    cy.getByQA("validation-summary").should("not.contain", completed);
  });
};

export const nameSectionSubheadings = () => {
  ["First name", "Last name", "Phone number", "Email"].forEach(subheading => {
    cy.getByLabel(subheading);
  });
  cy.paragraph("This information will be used to create an account for this person in the Innovation Funding Service.");
  cy.get("#hint-for-contact1Phone").contains(
    "We may use this to contact the partner for more information about this request.",
  );
};

export const validateNameOverLimit = () => {
  [
    ["First name", loremIpsum51Char],
    ["Last name", loremIpsum51Char],
    ["Phone number", loremIpsum21Char],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().invoke("val", input).trigger("input");
  });
  cy.getByLabel("Email").invoke("val", loremIpsum256Char).trigger("input");
  cy.getByLabel("Email").type("{moveToEnd");
  cy.clickOn("Save and return to summary");
  cy.validationLink(`Finance contact first name must be 50 characters or less.`);
  cy.paragraph(`Finance contact first name must be 50 characters or less.`);
  cy.validationLink("Finance contact phone number must be 20 characters or less.");
  cy.paragraph("Finance contact phone number must be 20 characters or less.");
  cy.validationLink("Finance contact email address must be 255 characters or less.");
  cy.paragraph("Finance contact email address must be 255 characters or less.");
};

export const validateNameForm = () => {
  cy.reload();
  [
    ["First name", loremIpsum50Char],
    ["Last name", loremIpsum50Char],
    ["Phone number", loremIpsum20Char],
    ["Email", loremIpsum255Char],
  ].forEach(([input, copy]) => {
    cy.getByLabel(input).invoke("val", copy).trigger("input");
    cy.wait(500);
  });
  cy.clickOn("Save and return to summary");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("dt").contains("Project role");
  cy.getListItemFromKey("First name", "Edit").click();
};

export const completeNameForm = () => {
  [
    ["First name", "Joseph"],
    ["Last name", "Dredd"],
    ["Phone number", "01234567890"],
    ["Email", "j.dredd@mc1justice.law"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().type(input);
  });
  cy.clickOn("Save and return to summary");
  cy.get("dt").contains("Project role");
};

export const validateWithoutName = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  ["Enter funding level."].forEach(valMsg => {
    cy.validationLink(valMsg);
  });
  [
    "Enter organisation name.",
    "Enter registered address.",
    "Enter registration number.",
    "Select participant size.",
    "Enter number of employees.",
    "Enter financial year end.",
    "Enter financial year end turnover.",
    "Select project location.",
    "Enter project city.",
    "Enter project postcode",
    "Enter finance contact first name.",
    "Enter finance contact last name.",
    "Enter finance contact phone number.",
    "Enter finance contact email address.",
  ].forEach(completed => {
    cy.getByQA("validation-summary").should("not.contain", completed);
  });
};

export const displayCostCatTable = () => {
  ["Category", "Cost"].forEach(head => {
    cy.tableHeader(head);
  });
  let baseNumber = 0;
  let newCurrency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  let inputVal = newCurrency.format(baseNumber);
  [
    ["Labour", inputVal],
    ["Overheads", inputVal],
    ["Materials", inputVal],
    ["Capital usage", inputVal],
    ["Subcontracting", inputVal],
    ["Travel and subsistence", inputVal],
    ["Other costs", inputVal],
    ["Other costs 2", inputVal],
    ["Other costs 3", inputVal],
    ["Other costs 4", inputVal],
    ["Other costs 5", inputVal],
  ].forEach(([costCat, value], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costCat);
        cy.get("td:nth-child(2)").contains(value);
        cy.get("td:nth-child(3)").contains("Edit");
      });
  });
};

export const completeAcademicCostCatTable = () => {
  ["Category", "Cost"].forEach(head => {
    cy.tableHeader(head);
  });
  let baseNumber = 333.33;
  cy.get("#tsb-reference").clear().type("1234567");
  const rows = [
    ["Directly incurred - Staff", baseNumber.toString()],
    ["Directly incurred - Travel and subsistence", baseNumber.toString()],
    ["Directly incurred - Equipment", baseNumber.toString()],
    ["Directly incurred - Other costs", baseNumber.toString()],
    ["Directly allocated - Investigations", baseNumber.toString()],
    ["Directly allocated - Estates costs", baseNumber.toString()],
    ["Directly allocated - Other costs", baseNumber.toString()],
    ["Indirect costs - Investigations", baseNumber.toString()],
    ["Exceptions - Staff", baseNumber.toString()],
    ["Exceptions - Travel and subsistence", baseNumber.toString()],
    ["Exceptions - Equipment", baseNumber.toString()],
    ["Exceptions - Other costs", baseNumber.toString()],
  ] as const;

  rows.forEach(([costCat, value]) => {
    cy.getTableRow(costCat).within(() => {
      const input = `input[aria-label="value of academic cost item ${costCat}"]`;
      cy.get(input).clear();
      cy.get(input).type(value);
    });
  });
};

export const completeLabourForm = () => {
  cy.get("a").contains("Add a cost").click();
  [
    ["Role within project", "Test"],
    ["Gross employee cost", "6666.66"],
    ["Rate", "222.22"],
    ["Days to be spent by all staff with this role", "30"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().type(input);
  });
  cy.inputPrefix("£", 2);
  cy.inputSuffix("per day", 1);
  cy.clickOn("Save and return to labour");
  cy.get("h2").contains("Labour");
  cy.wait(1000);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completeOverheadsSection = () => {
  cy.getByLabel("20%").click();
  cy.clickOn("Save and return to project costs");
  cy.get("tr").contains("20%");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completeMaterialsForm = () => {
  cy.get("a").contains("Add a cost").click();
  [
    ["Item", "Hammer"],
    ["Quantity", "666"],
    ["Cost per item", "10.01"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().type(input);
  });
  cy.inputPrefix("£", 1);
  cy.clickOn("Save and return to materials");
  cy.get("h2").contains("Materials");
  cy.wait(1000);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completeCapUsageForm = () => {
  cy.get("a").contains("Add a cost").click();
  cy.getByLabel("Item description").clear().type("Test");
  cy.getByLabel("New").click();
  [
    ["Depreciation period", "20"],
    ["Net present value", "2000"],
    ["Residual value at end of project", "1000"],
    ["Utilisation", "99"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().type(input);
  });
  cy.inputPrefix("£", 2);
  ["%", "months"].forEach(suffix => {
    cy.inputSuffix(suffix, 2);
  });
  cy.clickOn("Save and return to capital usage");
  cy.wait(1000);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completeSubcontractingForm = () => {
  cy.get("a").contains("Add a cost").click();
  [
    ["Subcontractor name", "Munce Inc"],
    ["Country where the subcontractor will work", "USA"],
    [
      "Role of the the subcontractor in the project and description of the work they will do",
      "Resyk into canned form for Megacity 1.",
    ],
    ["Cost", "3000"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().type(input);
  });
  cy.wait(500);
  cy.inputPrefix("£", 1);
  cy.clickOn("Save and return to subcontracting");
  cy.get("th").contains("Description");
  cy.wait(1000);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completeTandSForm = () => {
  cy.get("a").contains("Add a cost").click();
  [
    ["Purpose of journey or description of subsistence cost", "Journeying into the cursed earth."],
    ["Number of times", "2"],
    ["Cost of each", "500"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).clear().type(input);
  });
  cy.wait(500);
  cy.inputPrefix("£", 1);
  cy.clickOn("Save and return to travel and subsistence");
  cy.tableHeader("Description");
  cy.wait(1000);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completeOtherCostsForm = (costsNumber?: string) => {
  if (costsNumber === undefined) {
    costsNumber = "";
  }
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains("Other costs");
  [
    [
      "Description and justification of the cost",
      "500x Lawgiver Mk2 standard execution rounds, 200x Lawgiver Mk2 hi-ex rounds, 10x stumm grenades",
    ],
    ["Estimated cost", "1000"],
  ].forEach(([label, input]) => {
    cy.getByLabel(label).type(input);
  });
  cy.wait(500);
  cy.inputPrefix("£", 1);
  cy.get("button").contains(`Save and return to other costs${costsNumber}`).click();
  cy.get("h2").contains(`Other costs`);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
};

export const completedCostCatProfiles = () => {
  const oneThousand = "£1,000.00";
  [
    ["Labour", "£6,666.60"],
    ["Overheads", "£1,333.32"],
    ["Materials", "£6,666.66"],
    ["Capital usage", "£990.00"],
    ["Subcontracting", "£3,000.00"],
    ["Travel and subsistence", oneThousand],
    ["Other costs", oneThousand],
    ["Other costs 2", oneThousand],
    ["Other costs 3", oneThousand],
    ["Other costs 4", oneThousand],
    ["Other costs 5", oneThousand],
  ].forEach(([costcat, cost], index) => {
    cy.get("tr")
      .eq(index + 1)
      .within(() => {
        cy.get("td:nth-child(1)").contains(costcat);
        cy.get("td:nth-child(2)").contains(cost);
      });
  });
  cy.get("tfoot").within(() => {
    cy.get("tr").within(() => {
      cy.get("th:nth-child(1)").contains("Total costs (£)");
      cy.get("th:nth-child(2)").contains("£24,656.58");
    });
  });
};

export const correctFundingLevelCopy = () => {
  [
    "The maximum the new organisation can enter is based on their size, type of organisation and research category of the project, based on the ",
    " (opens in new window). This will be reviewed by Innovate UK to ensure the project stays within the funding rules.",
    "The percentage applied for must reflect other funding received.",
  ].forEach(copy => {
    cy.paragraph(copy);
  });
  cy.get("a").contains("Innovate UK general guidance for grant applicants");
};

export const fundingLevelInputValidation = () => {
  [
    ["-1", "Funding level must be 0% or more."],
    ["99999999", "Enter a funding level up to 100%."],
    ["101", "Enter a funding level up to 100%."],
    ["100.5", "Enter a funding level up to 100%."],
    ["Spagbol", "Funding level must be a number."],
    ["!%^&*(", "Funding level must be a number."],
  ].forEach(([input, message]) => {
    cy.get("#awardRate").clear().type(input);
    cy.wait(500);
    cy.clickOn("Save and return to summary");
    cy.validationLink(message);
  });
};

export const validateWithoutFundingLevel = () => {
  cy.getByLabel("I agree with this change.").click();
  cy.clickOn("Save and return to request");
  cy.getByQA("validation-summary").should("not.exist");
  cy.get("h2").contains("Details");
};
/**
 * N.B. ["Partner contribution to project", "£6,164.15"] has been changed from .14 to .15
 * It is becoming apparent that a general rule for rounding needs to be decided.
 * UCD is looking into a similar issue for reallocate project costs.
 */
export const checkDetailsScreenComplete = () => {
  [
    ["Project role", "Collaborator"],
    ["Commercial or economic project outputs", "No"],
    ["Organisation type", "Business"],
    ["Eligibility of aid declaration", "Not applicable"],
    ["Organisation name", "A LIMITED"],
    ["Registration number", "11790215"],
    ["Registered address", "38 Springfield Road, Gillingham, Kent, England, ME7 1YJ"],
    ["Size", "Medium"],
    ["Number of full time employees", "100"],
    ["End of financial year", "2024"],
    ["Turnover", "£300,000.00"],
    ["Project location", "Inside the United Kingdom"],
    ["Name of town or city", "Swindon"],
    ["Postcode", "SN5 1LT"],
    ["First name", "Joseph"],
    ["Last name", "Dredd"],
    ["Phone number", "01234567890"],
    ["Email", "j.dredd@mc1justice.law"],
    ["Project costs for new partner", "£24,656.58"],
    ["Other sources of funding", "No"],
    ["Funding level", "75.00%"],
    ["Funding sought", "£18,492.44"],
    ["Partner contribution to project", "£6,164.15"],
    ["Partner agreement", "Not applicable"],
  ].forEach(([section, data]) => {
    cy.getListItemFromKey(section, data);
  });
};

export const jeSDetailsScreenComplete = () => {
  [
    ["Project role", "Project Lead"],
    ["Commercial or economic project outputs", "No"],
    ["Organisation type", "Research"],
    ["Eligibility of aid declaration", "Not applicable"],
    ["Organisation name", "Swindon University"],
    ["Size", "Academic"],
    ["Project location", "Inside the United Kingdom"],
    ["Name of town or city", "Swindon"],
    ["Postcode", "SN5 1LT"],
    ["First name", "Joseph"],
    ["Last name", "Dredd"],
    ["Phone number", "01234567890"],
    ["Email", "j.dredd@mc1justice.law"],
    ["Je-S form", "Not applicable"],
    ["TSB reference", "1234567"],
    ["Project costs for new partner", "£3,999.96"],
    ["Other sources of funding", "No"],
    ["Funding level", "75.00%"],
    ["Funding sought", "£2,999.97"],
    ["Partner contribution to project", "£999.99"],
    ["Partner agreement", "Not applicable"],
  ].forEach(([section, data]) => {
    cy.getListItemFromKey(section, data);
  });
};

export const accessOtherPublicFunding = () => {
  cy.getListItemFromKey("Other sources of funding", "Edit").click();
  cy.get("h2").contains("Other public sector funding?");
  cy.getByLabel("Yes").click();
  cy.button("Save and continue").click();
  cy.paragraph(
    "Include all sources of funding the new partner is receiving on top of the funding they are claiming from Innovate UK. These will be taken into account when calculating the funding they will receive.",
  );
  ["Source of funding", "Date secured (MM YYYY)", "Funding amount"].forEach(header => {
    cy.tableHeader(header);
  });
};

export const validateOtherSourceInput = () => {
  [
    ["source of funding item 1", loremIpsum50Char],
    ["month funding is secured for item 1", loremIpsum20Char],
    ["year funding is secured for item 1", loremIpsum20Char],
    ["funding amount for item 0", loremIpsum50Char],
  ].forEach(([input, copy]) => {
    cy.getByAriaLabel(input).clear().type(copy);
  });
  cy.clickOn("Save and return to summary");
  cy.validationLink("Date secured must be a date.");
  cy.validationLink("Funding amount must be a number");
  cy.paragraph("Date secured must be a date.");
  cy.paragraph("Funding amount must be a number");
};

export const completeOtherSourceLine = () => {
  [
    ["source of funding item 1", "Side project cash injection"],
    ["month funding is secured for item 1", "02"],
    ["year funding is secured for item 1", "2024"],
    ["funding amount for item 0", "10000"],
  ].forEach(([input, copy]) => {
    cy.getByAriaLabel(input).clear().type(copy);
  });

  cy.clickOn("Save and return to summary");
  cy.get("dt").contains("Project role");
};

export const jesCompleteOtherSourceLine = () => {
  [
    ["source of funding item 1", "Side project cash injection"],
    ["month funding is secured for item 1", "02"],
    ["year funding is secured for item 1", "2024"],
    ["funding amount for item 0", "1000"],
  ].forEach(([input, copy]) => {
    cy.getByAriaLabel(input).clear().type(copy);
  });

  cy.clickOn("Save and return to summary");
  cy.get("dt").contains("Project role");
};

export const checkDetailsAgain = () => {
  cy.getListItemFromKey("Other sources of funding?", "Yes");
  cy.getListItemFromKey("Funding from other sources", "£10,000.00");
};
export const jesCheckDetailsAgain = () => {
  cy.getListItemFromKey("Other sources of funding?", "Yes");
  cy.getListItemFromKey("Funding from other sources", "£1,000.00");
};

export const accessPartnerAgreement = () => {
  cy.getListItemFromKey("Partner agreement", "Edit").click();
  cy.get("legend").contains("Upload partner agreement");
};

export const uploadTestFile = () => {
  cy.fileInput(testFile);
  cy.wait(500);
  cy.button("Upload documents").click();
  cy.validationNotification(`Your document has been uploaded.`);
  cy.wait(500);
  ["File name", "Type", "Date uploaded", "Size", "Uploaded by"].forEach(header => {
    cy.tableHeader(header);
  });

  ["testfile.doc", "Agreement to PCR", uploadDate, "0KB", "James Black", "Remove"].forEach((lineItem, index) => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get(`td:nth-child(${index + 1})`).contains(lineItem);
      });
  });
  cy.clickOn("Save and return to summary");
};

export const nonAidSummaryIncomplete = () => {
  cy.clickOn("Save and return to summary");
  [
    ["Project role", "Collaborator"],
    ["Commercial or economic project outputs", "No"],
    ["Organisation type", "Research"],
    ["Eligibility of aid declaration", "Not applicable"],
    ["Size", "Academic"],
    ["Je-S form", "Not applicable"],
    ["Project costs for new partner", "£0.00"],
    ["Other sources of funding?", "No"],
    ["Funding sought", "£0.00"],
    ["Partner contribution to project", "£0.00"],
    ["Partner agreement", "Not applicable"],
  ].forEach(([section, data]) => {
    cy.getListItemFromKey(section, data);
  });
};

export const companyHouseSwindonUniversity = () => {
  cy.get(`input[id="searchJesOrganisations"]`).clear().wait(500);
  cy.get(`input[id="searchJesOrganisations"]`).type("Swindon");
  cy.getByLabel("Swindon University").click();
  cy.clickOn("Save and return to summary");
};

export const deleteCost = () => {
  cy.tableCell("Labour").siblings().contains("Edit").click();
  cy.get("h2").contains("Labour");
  cy.clickLink("Law keeper", "Remove");
  cy.getByQA("validation-message-content").contains("All the information will be permanently deleted.");
  cy.get("h2").contains("Delete labour");
  cy.button("Delete cost").click();
  cy.get("h2").contains("Labour");
  cy.get("td").should("not.have.text", "Law keeper");
};

export const deleteCoste2e = () => {
  cy.tableCell("Labour").siblings().contains("Edit").click();
  cy.get("h2").contains("Labour");
  cy.tableCell("Test").siblings().contains("Remove").click();
  cy.getByQA("validation-message-content").contains("All the information will be permanently deleted.");
  cy.get("h2").contains("Delete labour");
  [
    ["Role within project", "Test"],
    ["Gross employee cost", "£6,666.66"],
    ["Rate (£/day)", "£222.22"],
    ["Days to be spent by all staff with this role", "30"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
  cy.button("Delete cost").click();
  cy.get("h2").contains("Labour");
  cy.get("td").should("not.have.text", "Test");
};

export const jesDeleteCostCat = () => {
  cy.getTableRow("Directly incurred - Staff").within(() => {
    cy.get('input[type="text"]').clear().type("0");
  });
};

export const addManyLines = () => {
  const wait = 250;
  for (let i = 1; i < 21; i++) {
    let subtotal = 1332.66 * i;
    let GBPTotal = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    });
    cy.log(`***Adding cost item number ${i}***`);
    cy.wait(wait);
    cy.get("a").contains("Add a cost").click();
    cy.getByLabel("Role within project").type(`Lorem ${i}`);
    cy.wait(wait);
    cy.getByLabel("Gross employee cost").type("1000");
    cy.wait(wait);
    cy.getByLabel("Rate (£/day)").type("666.33");
    cy.wait(wait);
    cy.getByLabel("Days to be spent by all staff with this role").type("2");
    cy.wait(wait);
    cy.clickOn("Save and return to labour");
    cy.tableCell(`Lorem ${i}`);
    cy.checkTotalFor("Total labour", GBPTotal.format(subtotal));
  }
};

export const clearValidationAddManyOther = () => {
  cy.wait(1000);
  cy.reload();
  cy.get("h2").contains("Other public sector funding?");
  for (let i = 1; i < 51; i++) {
    cy.wait(300);
    cy.clickOn("Add another source of funding");
    cy.getByAriaLabel(`source of funding item ${i}`).type(`Lorem ${i}`);
    cy.wait(200);
    cy.getByAriaLabel(`month funding is secured for item ${i}`).type(`09`);
    cy.wait(200);
    cy.getByAriaLabel(`year funding is secured for item ${i}`).type("2023");
    cy.wait(200);
    cy.getByAriaLabel(`funding amount for item ${i - 1}`).type("333.33");
    cy.wait(200);
    cy.get("tfoot").within(() => {
      let total = i * 333.33;
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get("th:nth-child(3)").contains(newCurrency.format(total));
        });
    });
  }
  cy.wait(1000);
  cy.intercept("PUT", `/api/pcrs/**`).as("waitForLoad");
  cy.clickOn("Save and return to summary");
  cy.wait("@waitForLoad");
};

export const otherFundingCorrectlyDisplayed = () => {
  [
    ["Project costs for new partner", "£50,000.00"],
    ["Other sources of funding?", "Yes"],
    ["Funding from other sources", "£16,666.50"],
  ].forEach(([key, item]) => {
    cy.getListItemFromKey(key, item);
  });
};

export const deleteOtherFundingLines = () => {
  cy.get("main").within(() => {
    cy.get("tr").then($rows => {
      let rowNumber = $rows.length;
      cy.log(`Number of rows is ${rowNumber}`);
      if (rowNumber > 3) {
        for (let i = rowNumber; i > 3; i--) {
          cy.log(`***DELETING ROW NUMBER ${rowNumber}***`);
          cy.get("tr")
            .eq(i - 3)
            .within(() => {
              cy.button("Remove").click();
              cy.wait(500);
            });
        }
      } else if (rowNumber <= 3) {
        throw new Error("Test has failed as no line items are present to delete!");
      }
      cy.intercept("PUT", `/api/pcrs/**`).as("waitForLoad");
      cy.clickOn("Save and return to summary");
      cy.wait("@waitForLoad");
      [
        ["Project costs for new partner", "£50,000.00"],
        ["Other sources of funding?", "Yes"],
        ["Funding from other sources", "£0.00"],
      ].forEach(([key, item]) => {
        cy.getListItemFromKey(key, item);
      });
    });
  });
};

export const otherSourcesLineItemsSaved = () => {
  cy.getListItemFromKey("Funding from other sources", "Edit").click();
  cy.get("h2").contains("Other public sector funding?");
  for (let i = 1; i < 51; i++) {
    cy.getByAriaLabel(`source of funding item ${i}`).should("have.value", `Lorem ${i}`);
    cy.getByAriaLabel(`month funding is secured for item ${i}`).should("have.value", `09`);
    cy.getByAriaLabel(`year funding is secured for item ${i}`).should("have.value", "2023");
    cy.getByAriaLabel(`funding amount for item ${i - 1}`).should("have.value", "333.33");
  }
  cy.get("tfoot").within(() => {
    cy.get("tr")
      .eq(1)
      .within(() => {
        cy.get("th:nth-child(3)").contains("£16,666.50");
      });
  });
};

export const validateJesCostsFields = () => {
  cy.get("#tsb-reference").clear().type("1234567");
  const fields = [
    "value of academic cost item Directly incurred - Staff",
    "value of academic cost item Directly incurred - Travel and subsistence",
    "value of academic cost item Directly incurred - Equipment",
    "value of academic cost item Directly incurred - Other costs",
    "value of academic cost item Directly allocated - Investigations",
    "value of academic cost item Directly allocated - Estates costs",
    "value of academic cost item Directly allocated - Other costs",
    "value of academic cost item Indirect costs - Investigations",
    "value of academic cost item Exceptions - Staff",
    "value of academic cost item Exceptions - Travel and subsistence",
    "value of academic cost item Exceptions - Equipment",
    "value of academic cost item Exceptions - Other costs",
  ] as const;

  fields.forEach(input => {
    cy.getByAriaLabel(input).clear().type("9999999999999999");
  });

  cy.button("Save and continue").click();
  cy.validationLink("Cost must be £999,999,999,999.00 or less.");

  fields.forEach(input => {
    cy.getByAriaLabel(input).clear();
  });
  cy.button("Save and continue").click();
  cy.validationLink("Enter cost");
};

export const checkPcrForValidation = () => {
  [
    "Eligibility of aid declaration",
    "Organisation name",
    "Size",
    "End of financial year",
    "Project location",
    "First name",
    "Project costs for new partner",
    "Other sources of funding",
    "Funding from other sources",
    "Funding level",
  ].forEach(section => {
    cy.getListItemFromKey(section, "Edit").click();
    cy.backLink("Back to request");
    cy.getByQA("validation-summary").should("not.exist");
    cy.backLink("Back to request").click();
    cy.heading("Request");
    cy.get("a").contains("Add a partner").click();
    cy.heading("Add a partner");
  });
};

export const clearSavetoSummary = () => {
  ["Organisation name", "Registration number", "Registered address"].forEach(inputField => {
    cy.getByLabel(inputField).clear();
  });
  cy.clickOn("Save and return to summary");
  cy.get("h2").contains("Organisation");
};

export const markAsCompletePromptValidation = () => {
  cy.getByLabel("I agree with this change").check();
  cy.clickOn("Save and return to request");
  [
    "Enter funding level.",
    "Enter finance contact email address.",
    "Enter finance contact name.",
    "Enter finance contact phone number.",
    "Enter finance contact surname.",
    "Enter organisation name.",
    "Enter project city.",
    "Select project location.",
    "Enter registered address.",
    "Enter registration number.",
    "Enter number of employees.",
    "Enter financial year end.",
    "Enter financial year end turnover.",
  ].forEach(validationMsg => {
    cy.validationLink(validationMsg);
  });
};

export const accessCompanyHouseValidationPersists = () => {
  cy.getListItemFromKey("Organisation name", "Edit").click();
  cy.get("h2").contains("Company house");
  ["Enter organisation name.", "Enter registration number.", "Enter registered address."].forEach(validationMsg => {
    cy.validationLink(validationMsg);
  });
};

export const navigateToPartnerCosts = () => {
  cy.getListItemFromKey("Project costs for new partner", "Edit").click();
  cy.get("h2").contains("Project costs for new partner");
};
