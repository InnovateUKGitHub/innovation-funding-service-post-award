import { loremIpsum100Char, loremIpsum16k, loremIpsum32k } from "common/lorem";
import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";
import { contractorName255, validateSubcontractorName } from "./subcontractor-steps";

const pm = "james.black@euimeabs.test";
let currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

describe("PCR > Create 'Approve a new subcontractor'", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Approve a new subcontractor");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a new 'Approve a new subcontractor' PCR", () => {
    cy.getByLabel("Approve a new subcontractor").check();
    cy.get(".govuk-hint").contains("If you are requesting a change in subcontractor, please select this option.");
    cy.wait(500);
    cy.button("Create request").click();
    cy.heading("Request");
  });

  //it("Should add 5 more types and correctly display them in the Request page", () => {
  //  cy.get("a").contains("Add types").click();
  //
  //  [
  //    "Remove a partner",
  //    "Add a partner",
  //    "Change project scope",
  //    "Change a partner's name",
  //    "Put project on hold",
  //  ].forEach(pcr => {
  //    cy.getByLabel(pcr).wait(500).click();
  //  });
  //  cy.button("Add to request").click();
  //  cy.heading("Request");
  //  [
  //    "Remove a partner",
  //    "Add a partner",
  //    "Change project scope",
  //    "Change a partner's name",
  //    "Put project on hold",
  //    "Approve a new subcontractor",
  //  ].forEach(pcr => {
  //    cy.get("li").contains(pcr);
  //  });
  //});

  it("Should have a working backlink", () => {
    cy.heading("Request");
    cy.get("li").contains("Approve a new subcontractor").click();
    cy.heading("Approve a new subcontractor");
    cy.backLink("Back to request").click();
    cy.heading("Request");
    cy.get("li").contains("Approve a new subcontractor").click();
    cy.heading("Approve a new subcontractor");
  });

  it("Should have guidance copy at the top of the page", () => {
    cy.paragraph(
      "Let us know if you are working with a new subcontractor. We will need to undertake viability checks, as stated in the application process.",
    );
  });

  it("Should mark 'yes', save and continue, then mark as 'I agree with this change' and click 'Submit request' prompting validation", () => {
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
  });

  it("Should return to previous screen by clicking an Edit button", () => {
    cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
    cy.getByLabel("Company name of subcontractor");
  });

  it("Should reload the page", () => {
    cy.reload();
  });

  it("Should validate the length of the company name input field to 255 characters", validateSubcontractorName);

  it("Should validate that a maximum of 20 characters can be entered into registration number", () => {
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
  });

  it("Should have  'Is there a relationship' Yes/No radio buttons", () => {
    cy.getByLabel("Is there a relationship between the partner and the subcontractor?");
    cy.getByLabel("Yes");
    cy.getByLabel("No").click();
  });

  it("Should display an input box once 'yes' is selected", () => {
    cy.get(".govuk-radios__conditional--hidden");
    cy.getByLabel("Yes").click();
    cy.get(".govuk-radios__conditional");
    cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor");
  });

  it("Should remove the input box if 'No' is selected", () => {
    cy.getByLabel("No").click();
    cy.get(".govuk-radios__conditional--hidden");
  });

  it("Should bring back the box when 'yes' is clicked", () => {
    cy.getByLabel("Yes").click();
    cy.get(".govuk-radios__conditional");
  });

  it("Should validate maximum 16k character input", () => {
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
  });

  it("Should save 16k characters and continue", () => {
    cy.button("Save and continue").click();
    cy.getListItemFromKey(
      "Please describe the relationship between the collaborator and the new subcontractor",
      "Pippin's",
    );
  });

  it("Should return and display the populated box", () => {
    cy.getListItemFromKey(
      "Please describe the relationship between the collaborator and the new subcontractor",
      "Edit",
    ).click();
    cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor").should(
      "have.value",
      loremIpsum16k,
    );
  });

  it("Should allow you to click 'No' and then save and continue", () => {
    cy.getByLabel("No").click();
    cy.get(".govuk-radios__conditional--hidden");
    cy.button("Save and continue").click();
    cy.get("dt").should(
      "not.have.text",
      "Please describe the relationship between the collaborator and the new subcontractor",
    );
    cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
  });

  it("Click 'Yes' and the contents are no longer there.", () => {
    cy.getByLabel("Yes").click();
    cy.get(".govuk-radios__conditional");
    cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor").should(
      "have.value",
      "",
    );
  });

  it("Should populate the relationship information", () => {
    cy.getByLabel("Please describe the relationship between the collaborator and the new subcontractor")
      .invoke("val", loremIpsum16k)
      .trigger("input");
  });

  it("Should validate 'Country where the subcontractor's work will be carried out' for 100 characters", () => {
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
  });

  it("Should have a 'Brief description of work to be carried out by subcontractor' input", () => {
    cy.getByLabel("Brief description of work to be carried out by subcontractor")
      .clear()
      .invoke("val", contractorName255)
      .trigger("input");
    cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}").type("t");
    cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}{backspace}");
  });

  it("Should not display character counter", () => {
    cy.get(".character-count").contains("You have 0 characters remaining");
  });

  it("Should increase character count by one revealing character counter", () => {
    cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}").type("t");
    cy.get(".character-count");
    cy.paragraph("You have 1 character too many");
    cy.button("Save and continue").click();
    cy.validationLink("Description of work to be carried out by the subcontractor must be 255 characters or less");
    cy.paragraph("Description of work to be carried out by the subcontractor must be 255 characters or less");
  });

  it("Should reduce the number of characters to 255 and save and continue", () => {
    cy.getByLabel("Brief description of work to be carried out by subcontractor").type("{moveToEnd}{backspace}");
    cy.paragraph("You have 0 characters remaining");
    cy.button("Save and continue").click();
    cy.getListItemFromKey("Brief description of work to be carried out by subcontractor", contractorName255);
    cy.getListItemFromKey("Brief description of work to be carried out by subcontractor", "Edit").click();
  });

  it("Should have saved the Brief description and the box is populated", () => {
    cy.getByLabel("Brief description of work to be carried out by subcontractor").should(
      "have.value",
      contractorName255,
    );
  });

  it("Should have a GBP currency input field that only accepts number input", () => {
    cy.get(".govuk-input__prefix").should("have.text", "£");
    ["Lorem ipsum", "$^*", "*()", "/``/q", "99.999"].forEach(input => {
      cy.getByLabel("Cost of work to be carried out by the new subcontractor").clear().type(input);
      cy.button("Save and continue").click();
      cy.validationLink("Enter a valid cost of work.");
      cy.paragraph("Enter a valid cost of work.");
      cy.getByLabel("Cost of work to be carried out by the new subcontractor").clear();
    });
  });

  /**
   * TODO: Double-check ACs
   */
  it("Should have a 11 numeric character limitation on the currency input field", () => {
    cy.getByLabel("Cost of work to be carried out by the new subcontractor").type("999999999999");
    cy.button("Save and continue").click();
    cy.validationLink("Cost of work must be 11 characters or less.");
    cy.paragraph("Cost of work must be 21 characters or less.");
    cy.getByLabel("Cost of work to be carried out by the new subcontractor").type("{moveToEnd}{backspace}");
    cy.button("Save and continue").click();
    cy.getListItemFromKey("Cost of work to be carried out by the new subcontractor", "£99,999,999,999.00");
    cy.getListItemFromKey("Cost of work to be carried out by the new subcontractor", "Edit").click();
  });
  /**
   * TODO: TEMP STEP UNTIL BUG FIXED WITH CURRENCY BOX
   */
  it("Should clear currency box for now", () => {
    cy.getByLabel("Cost of work to be carried out by the new subcontractor").clear();
  });

  it("Should have a 'Justification' input which will accept 32k characters", () => {
    cy.getByLabel("Justification").invoke("val", loremIpsum32k).trigger("input");
    cy.getByLabel("Justification").type("{moveToEnd}").type("1");
    cy.paragraph("You have 1 character too many");
    cy.button("Save and continue").click();
    cy.validationLink("Justification for including the subcontractor must be 32000 characters or less");
    cy.paragraph("Justification for including the subcontractor must be 32000 characters or less");
  });

  it("Should reduce and save and continue", () => {
    cy.getByLabel("Justification").type("{moveToEnd}{backspace}");
    cy.paragraph("You have 0 characters remaining");
    cy.button("Save and continue").click();
    cy.getListItemFromKey("Justification", "Pippin's");
  });

  it("Should display the completed request", () => {
    [
      ["Company name of subcontractor", ""],
      ["Company registration number", ""],
      ["Is there a relationship between the partner and the subcontractor?", ""],
      ["Please describe the relationship between the collaborator and the new subcontractor", ""],
      ["Country where the subcontractor's work will be carried out", ""],
      ["Description of the work to be carried out by subcontractor", ""],
      ["Justification", ""],
      ["Cost of the work to be carried out by the new subcontractor", ""],
    ].forEach(([key, item]) => {
      cy.getListItemFromKey(key, item);
    });
  });

  it("Should have a working Edit button against each list item", () => {
    [
      "Company name of subcontractor",
      "Company registration number",
      "Is there a relationship between the partner and the subcontractor?",
      "Please describe the relationship between the collaborator and the new subcontractor",
      "Country where the subcontractor's work will be carried out",
      "Description of the work to be carried out by subcontractor",
      "Justification",
      "Cost of the work to be carried out by the new subcontractor",
    ].forEach(listItem => {
      cy.getListItemFromKey(listItem, "Edit").click();
      cy.getByLabel("Company name of subcontractor");
      cy.button("Save and continue").click();
    });
  });

  it("Should have a mark as complete section", () => {
    cy.get("legend").contains("Mark as complete");
    cy.getByLabel("I agree with this change").click();
  });
});
