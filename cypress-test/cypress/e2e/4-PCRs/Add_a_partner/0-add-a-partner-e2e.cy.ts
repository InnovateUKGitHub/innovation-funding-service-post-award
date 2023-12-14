import {
  loremIpsum10Char,
  loremIpsum20Char,
  loremIpsum255Char,
  loremIpsum40Char,
  loremIpsum50Char,
} from "common/lorem";
import { visitApp } from "../../../common/visit";
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
import { pcrTidyUp } from "common/pcrtidyup";
import { navigateToCostCat } from "./add-partner-e2e-steps";

describe("PCR >  Add a partner > Create PCR", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner");
  });

  it("Should show the correct PCR type", correctPcrType);

  it("Should allow you to add more types of PCR", () => {
    cy.get("a.govuk-link").contains("Add types");
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

  it("Should attempt to submit prompting validation", () => {
    cy.clickOn("Submit request");
    cy.validationLink("Reasons entry must be complete.");
    cy.validationLink("Add a partner must be complete.");
    cy.paragraph("Add a partner must be complete.");
    cy.paragraph("Reasons entry must be complete.");
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
    cy.heading("Add a partner");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show correct subheadings", () => {
    ["New partner information", "Project role", "Project outputs", "Organisation type"].forEach(subheading => {
      cy.get("h2").contains(subheading);
    });
  });

  it("Should display correct guidance copy", () => {
    cy.getByQA("validation-message-content").contains("You cannot change this information after you continue.");
    cy.getByLabel("Will the new partner's work on the project be mostly commercial or economic?");
    cy.get("#isCommercialWork-hint").contains(
      "This question applies to all organisations, including research organisations that normally act non-economically.",
    );
    cy.get("#partnerType-hint").contains(
      "If the new partner's organisation type is not listed, contact your monitoring officer.",
    );
  });

  it("Should click 'Save and return to summary' prompting validation", () => {
    cy.clickOn("Save and return to summary");
    cy.validationLink("Select a project role.");
    cy.validationLink("Select a partner type.");
    cy.paragraph("Select a project role.");
    cy.paragraph("Select a partner type.");
  });

  it("Should expand 'What are the different types' section and check contents are correct", () => {
    cy.get("a").contains("What are the different types?").click();
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
  });

  it("Should click the Project role radio buttons in turn which will remove validation message", () => {
    ["Collaborator", "Project Lead"].forEach(radio => {
      cy.getByLabel(radio).click();
      cy.validationLink("Select a project role.").should("not.exist");
    });
  });

  it("Should still show the partner validation until the Partner type radio buttons are selected", () => {
    cy.validationLink("Select a partner type.");
    cy.paragraph("Select a partner type.");
    [
      "Business",
      "Research",
      "Research and Technology Organisation (RTO)",
      "Public Sector, charity or non Je-S registered research organisation",
    ].forEach(radio => {
      cy.getByLabel(radio).click();
      cy.validationLink("Select a partner type.").should("not.exist");
    });
  });

  it("Should select role 'Collaborator' and type 'Business' then 'Save and return to summary'", () => {
    ["Collaborator", "Business"].forEach(radio => {
      cy.getByLabel(radio).click();
    });
    cy.clickOn("Save and return to summary");
  });

  it("Should present a summary screen with correct subheadings", () => {
    cy.heading("Add a partner");
    ["Organisation", "Contacts", "Funding", "Agreement", "Mark as complete"].forEach(subheading => {
      cy.get("h2").contains(subheading);
    });
    cy.get("h3").contains("Finance contact");
  });

  it("Should mark as complete and click 'Save and return to request', prompting validation", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
    [
      "Enter an organisation name.",
      "Enter a registered address.",
      "Enter a registration number.",
      "Enter a financial year end.",
      "Enter a financial year end turnover.",
      "Enter a finance contact name.",
      "Enter a finance contact surname.",
      "Enter a finance contact phone number.",
      "Enter a finance contact email address.",
      "Select a project location.",
      "Enter a project city.",
      "Enter a project postcode",
      "Select a participant size.",
      "Enter the number of employees.",
      "Enter the funding level.",
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
      cy.get(".govuk-summary-list__row summary-list__row--error").contains(section);
    });
  });
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

  it("Should now validate but this time no validation link will appear for Organisation, registration or registered address", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
    [
      "Enter a financial year end.",
      "Enter a financial year end turnover.",
      "Enter a finance contact name.",
      "Enter a finance contact surname.",
      "Enter a finance contact phone number.",
      "Enter a finance contact email address.",
      "Select a project location.",
      "Enter a project city.",
      "Enter a project postcode",
      "Select a participant size.",
      "Enter the number of employees.",
      "Enter the funding level.",
    ].forEach(valMsg => {
      cy.validationLink(valMsg);
    });
    ["Enter an organisation name.", "Enter a registered address.", "Enter a registration number."].forEach(
      completed => {
        cy.validationLink(completed).should("not.exist");
      },
    );
  });

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

  it("Validate the input box", () => {
    ["-1", "a", "999999999"].forEach(input => {
      cy.get("input").clear().type(input);
      cy.wait(200);
      cy.clickOn("Save and return to summary");
      cy.validationLink("Please enter a valid number of employees.");
    });
  });

  it("Should select 'Medium' size and enter 100 employees", () => {
    cy.getByLabel("Medium").click();
    cy.get("input").clear().type("100");
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it("Should now validate but this time no validation link will appear for Size", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
    [
      "Enter a financial year end.",
      "Enter a financial year end turnover.",
      "Enter a finance contact name.",
      "Enter a finance contact surname.",
      "Enter a finance contact phone number.",
      "Enter a finance contact email address.",
      "Select a project location.",
      "Enter a project city.",
      "Enter a project postcode",
      "Enter the funding level.",
    ].forEach(valMsg => {
      cy.validationLink(valMsg);
    });
    [
      "Enter an organisation name.",
      "Enter a registered address.",
      "Enter a registration number.",
      "Select a participant size.",
      "Enter the number of employees.",
    ].forEach(completed => {
      cy.validationLink(completed).should("not.exist");
    });
  });

  it("Should access the 'End of financial year' section", () => {
    cy.getListItemFromKey("End of financial year", "Edit").click();
    ["Financial details", "End of financial year", "Turnover (£)"].forEach(subheading => {
      cy.get("h2").contains(subheading);
    });
  });

  it("Should validate the Month and Year box", () => {
    ["Month", "Year"].forEach(date => {
      cy.getByLabel(date);
    });
    ["£", "test", "9999", "-1", "-2022", "0"].forEach(input => {
      cy.getByLabel("Month").clear().type(input);
      cy.getByLabel("Year").clear().type(input);
      cy.clickOn("Save and return to summary");
      cy.validationLink("must be a whole number");
      cy.paragraph("must be a whole number");
    });
  });

  it("Should validate the Turnover box", () => {
    ["-1", "test copy", "99999999999999999999999999"].forEach(input => {
      cy.get("#financialYearEndTurnover").clear().type(input);
      cy.clickOn("Save and return to summary");
      cy.validationLink("must be a whole number");
      cy.paragraph("must be a whole number");
    });
  });

  it("Should enter valid details in both the date section and turnover section", () => {
    cy.getByLabel("Month").clear().type("03");
    cy.getByLabel("Year").clear().type("2024");
    cy.get("#financialYearEndTurnover").clear().type("300000");
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it("Should now validate but this time no validation link will appear for 'End of financial year' and 'Turnover'", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
    [
      "Enter a finance contact name.",
      "Enter a finance contact surname.",
      "Enter a finance contact phone number.",
      "Enter a finance contact email address.",
      "Select a project location.",
      "Enter a project city.",
      "Enter a project postcode",
      "Enter the funding level.",
    ].forEach(valMsg => {
      cy.validationLink(valMsg);
    });
    [
      "Enter an organisation name.",
      "Enter a registered address.",
      "Enter a registration number.",
      "Select a participant size.",
      "Enter the number of employees.",
      "Enter a financial year end.",
      "Enter a financial year end turnover.",
    ].forEach(completed => {
      cy.validationLink(completed).should("not.exist");
    });
  });

  it("Should access the 'Project location' section", () => {
    cy.getListItemFromKey("Project location", "Edit").click();
    ["Project location", "Name of town or city", "Postcode"].forEach(subheading => {
      cy.heading("h2").contains(subheading);
    });
  });

  it("Should contain correct guidance copy", () => {
    cy.get("#projectLocation-hint").contains(
      "Indicate where the majority of the work being done by this partner will take place.",
    );
    cy.get("#projecPostcode-hint").contains("If this is not available, leave this blank.");
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

  it("Should validate the Name of town or city input", () => {
    cy.get("#projectCity").clear().invoke("val", loremIpsum40Char).trigger("input");
    cy.get("#projectCity").type("{moveToEnd}").type("t");
    cy.clickOn("Save and return to Summary");
    cy.validationLink("Project city must be 40 characters or less.");
    cy.paragraph("Project city must be 40 characters or less.");
    cy.get("#projectCity").type("{moveToEnd}{backspace}");
    cy.validationLink("Project city must be 40 characters or less.").should("not.exist");
    cy.paragraph("Project city must be 40 characters or less.").should("not.exist");
  });

  it("Should validate the Postcode input", () => {
    cy.get("#projectPostcode").clear().invoke("val", loremIpsum10Char).trigger("input");
    cy.get("#projectPostcode").type("{moveToEnd}").type("t");
    cy.clickOn("Save and return to Summary");
    cy.validationLink("Project postcode must be 10 characters or less.");
    cy.paragraph("Project postcode must be 10 characters or less.");
    cy.get("#projectPostcode").type("{moveToEnd}{backspace}");
    cy.validationLink("Project postcode must be 10 characters or less.").should("not.exist");
    cy.paragraph("Project postcode must be 10 characters or less.").should("not.exist");
  });

  it("Should complete the form and Save and return", () => {
    cy.getByLabel("Inside the United Kingdom").click();
    cy.get("#projectCity").clear().type("Swindon");
    cy.get("#projectPostcode").clear().type("SN5 1LT");
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it("Should now validate but this time no validation link will appear for location, name of town, and postcode", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
    [
      "Enter a finance contact name.",
      "Enter a finance contact surname.",
      "Enter a finance contact phone number.",
      "Enter a finance contact email address.",
      "Enter the funding level.",
    ].forEach(valMsg => {
      cy.validationLink(valMsg);
    });
    [
      "Enter an organisation name.",
      "Enter a registered address.",
      "Enter a registration number.",
      "Select a participant size.",
      "Enter the number of employees.",
      "Enter a financial year end.",
      "Enter a financial year end turnover.",
      "Select a project location.",
      "Enter a project city.",
      "Enter a project postcode",
    ].forEach(completed => {
      cy.validationLink(completed).should("not.exist");
    });
  });

  it("Should access the First name section", () => {
    cy.getListItemFromKey("First name", "Edit").click();
    cy.get("h2").contains("Add person to organisation");
  });

  it("Should display the correct subheadings and copy", () => {
    ["First name", "Last name", "Phone number", " Email"].forEach(subheading => {
      cy.getByLabel(subheading);
    });
    cy.paragraph(
      "This information will be used to create an account for this person in the Innovation Funding Service.",
    );
    cy.get("#contact1Phone-hint").contains(
      "We may use this to contact the partner for more information about this request.",
    );
  });

  it("Should complete the form and prompt validation", () => {
    [
      ["First name", loremIpsum50Char, "name", "50"],
      ["Last name", loremIpsum50Char, "surname", "50"],
      ["Phone number", loremIpsum20Char, "phone number", "20"],
    ].forEach(([input, copy, section, charLimit]) => {
      cy.getByLabel(input).invoke("val", copy).trigger("input");
      cy.getByLabel(input).type("{moveToEnd}").type("t");
      cy.clickOn("Save and return to summary");
      cy.validationLink(`Finance contact ${section} must be ${charLimit} characters or less.`);
      cy.paragraph(`Finance contact ${section} must be ${charLimit} characters or less.`);
    });
    cy.getByLabel("Email").invoke("val", loremIpsum255Char).trigger("input");
    cy.getByLabel("Email").type("{moveToEnd}").type("t");
    cy.clickOn("Save and return to summary");
    cy.validationLink("Email address must be 255 characters or less.");
    cy.paragraph("Email address must be 255 characters or less.");
  });

  it("Should limit the characters to the correct length, removing validation", () => {
    [
      ["First name", "name", "50"],
      ["Last name", "surname", "50"],
      ["Phone number", "phone number", "20"],
    ].forEach(([input, section, charLimit]) => {
      cy.getByLabel(input).type("{moveToEnd}{backspace}");
      cy.validationLink(`Finance contact ${section} must be ${charLimit} characters or less.`).should("not.exist");
      cy.paragraph(`Finance contact ${section} must be ${charLimit} characters or less.`).should("not.exist");
    });
    cy.getByLabel("Email").type("{moveToEnd}{backspace}");
    cy.validationLink("Email address must be 255 characters or less.").should("not.exist");
    cy.paragraph("Email address must be 255 characters or less.").should("not.exist");
  });

  it("Should complete the form and Save and return", () => {
    [
      ["First name", "Joseph"],
      ["Last name", "Dredd"],
      ["Phone number", "01234567890"],
      ["Email", "j.dredd@mc1justice.law"],
    ].forEach(([label, input]) => {
      cy.getByLabel(label).clear().type(input);
    });
    cy.clickOn("Save and return to summary");
    cy.get("h2").contains("Organisation");
  });

  it("Should now validate but this time no validation link will appear for Name, number, email", () => {
    cy.getByLabel("I agree with this change.").click();
    cy.clickOn("Save and return to request");
    ["Enter the funding level."].forEach(valMsg => {
      cy.validationLink(valMsg);
    });
    [
      "Enter an organisation name.",
      "Enter a registered address.",
      "Enter a registration number.",
      "Select a participant size.",
      "Enter the number of employees.",
      "Enter a financial year end.",
      "Enter a financial year end turnover.",
      "Select a project location.",
      "Enter a project city.",
      "Enter a project postcode",
      "Enter a finance contact name.",
      "Enter a finance contact surname.",
      "Enter a finance contact phone number.",
      "Enter a finance contact email address.",
    ].forEach(completed => {
      cy.validationLink(completed).should("not.exist");
    });
  });

  it("Should access the Project costs for new partner section", () => {
    cy.getListItemFromKey("Project costs for new partner", "Edit").click();
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should display a cost category table", () => {
    ["Category", "Cost (£)"].forEach(head => {
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
    cy.get("tfoot").within(() => {
      cy.get("tr")
        .eq(1)
        .within(() => {
          cy.get("td:nth-child(1)").contains("Total costs (£)");
          cy.get("td:nth-child(2)").contains(inputVal);
        });
    });
  });

  it("Should access the Labour section", () => navigateToCostCat("Labour", 1));

  it("Should complete the Labour form", () => {
    [
      ["Role within project", "Test"],
      ["Gross employee cost", "6666.66"],
      ["Rate (£/day)", "222.22"],
      ["Days to be spent by all staff with this role", "30"],
    ].forEach(([label, input]) => {
      cy.getByLabel(label).clear().type(input);
    });
    cy.getByLabel("Total cost");
    cy.paragraph("£6,666.60");
    cy.clickOn("Save and return to labour");
    cy.get("h2").contains("Labour");
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should access the Overheads section", () => navigateToCostCat("Overheads", 2));

  it("Should complete the section as 20% overhead rate", () => {
    cy.getByLabel("20%").click();
    cy.paragraph("£1,333.32");
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should access the Materials section", () => {
    navigateToCostCat("Materials", 3);
  });

  it("Should complete the form", () => {
    [
      ["Item", "Hammer"],
      ["Quantity", "666"],
      ["Cost per item (£)", "10.01"],
    ].forEach(([label, input]) => {
      cy.getByLabel(label).clear().type(input);
    });
    cy.paragraph("£6,666.66");
    cy.clickOn("Save and return to materials");
    cy.get("h2").contains("Materials");
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should access the Capital usage section", () => navigateToCostCat("Capital usage", 4));

  it("Should complete the Capital usage form", () => {
    cy.getByLabel("Item description").clear().type("Test");
    cy.getByLabel("New").click();
    [
      ["Deprecation period (months)", "20"],
      ["Net present value (£)", "2000"],
      ["Residual value at end of project (£)", "1000"],
      ["Utilisation (%)", "99"],
    ].forEach(([label, input]) => {
      cy.getByLabel(label).clear().type(input);
    });
    cy.paragraph("£990.00");
    cy.clickOn("Save and return to capital usage");
    cy.get("h2").contains("Capital usage");
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should access the Subcontracting section", () => navigateToCostCat("Subcontracting", 5));

  it("Should complete the form for Subcontracting", () => {
    [
      ["Subcontractor name", "Munce Inc"],
      ["Country where the subcontractor will work", "USA"],
      [
        "Role of the subcontractor in the project and description of the work they will do",
        "Resyk into canned form for Megacity 1.",
      ],
      ["Cost (£)", "3000"],
    ].forEach(([label, input]) => {
      cy.getByLabel(label).clear().type(input);
    });
    cy.clickOn("Save and return to subcontracting");
    cy.get("h2").contains("Subcontracting");
    cy.clickOn("Save and return to project costs");
    cy.get("h2").contains("Project costs for new partner");
  });

  it("Should access the Travel and subsistence section", () => navigateToCostCat("Travel and subsistence", 6));

  it("Should access the Other costs section", () => navigateToCostCat("Other costs", 7));

  it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 2", 8));

  it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 3", 9));

  it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 4", 10));

  it("Should access the Other costs 2 section", () => navigateToCostCat("Other costs 5", 11));
});
