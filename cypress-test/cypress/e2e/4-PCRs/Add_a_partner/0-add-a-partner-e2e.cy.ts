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
});
