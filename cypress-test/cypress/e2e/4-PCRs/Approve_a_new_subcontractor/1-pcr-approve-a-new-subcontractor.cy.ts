import { pcrTidyUp } from "common/pcrtidyup";
import { visitApp } from "common/visit";

const pm = "james.black@euimeabs.test";

describe("PCR > Create 'Approve a new subcontractor'", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Approve a new subcontractor");
  });

  it("Should create a new 'Approve a new subcontractor' PCR", () => {
    cy.getByLabel("Approve a new subcontractor").check();
    cy.button("Create request").click();
    cy.heading("Request");
  });

  it("Should show the 'Approve a new subcontractor' under the request listing", () => {
    cy.get("li").contains("Approve a new subcontractor").click();
    cy.heading("Approve a new subcontractor");
  });

  it("Should have a working backlink", () => {
    cy.backLink("Back to request").click();
    cy.heading("Request");
    cy.get("li").contains("Approve a new subcontractor").click();
    cy.heading("Approve a new subcontractor");
  });

  it("Should have guidance copy at the top of the page", () => {
    cy.paragraph(
      "Please let us know if you are working with a new subcontractor, as Innovate UK will need to undertake viability checks, as per the application process.",
    );
  });

  it("Should have a freetext box to enter the subcontractor's name", () => {
    cy.getByLabel("Company name of subcontractor").clear().type("Planet Express");
  });

  it("Should validate the input fields field cannot be empty");

  it("Should validate the character length");

  it("Should have a freetext box for Companuy registration number", () => {
    cy.getByLabel("Company registration number").clear().type("12345678");
  });

  it("Should validate that a maximum of 8 characters can be entered");

  it("Should have  'Is there a relationship' yes/no radio buttons", () => {
    cy.getByLabel("Is there a relationship between the partner and the subcontactor?").contains("No").click();
    cy.getByLabel("Is there a relationship between the partner and the subcontactor?").contains("Yes").click();
  });

  it("Should display an input box if 'yes' is selected", () => {
    cy.getByLabel("whatevertheinputboxiscalled").should("be.visible");
    cy.paragraph("Please describe the relationship between the collaborator and the new subcontractor");
  });

  it("Should remove the input box if 'No' is selected", () => {
    cy.getByLabel("Is there a relationship between the partner and the subcontactor?").contains("No").click();
    cy.getByLabel("whatevertheinputboxiscalled").should("not.be.visible");
  });

  it("Should bring back the box when 'yes' is clicked", () => {
    cy.getByLabel("Is there a relationship between the partner and the subcontactor?").contains("Yes").click();
    cy.getByLabel("whatevertheinputboxiscalled").should("be.visible");
  });

  it("Should validate that only 150 characters can be entered");

  it("Should have an input for 'Country where the subcontractor's work will be carried out'", () => {
    cy.getByLabel("Country where the subcontractor's work will be carried out").clear().type("Wales");
  });

  it("Should have a 'Description of work to be carried out by subcontractor' input", () => {
    cy.getByLabel("Description of work to be carried out by subcontractor").clear().type("Making things");
  });

  it("Should validate the Description of work to be carried out by subcontractor input accepts 155 characters");

  it("Should have a GBP currency input field", () => {
    cy.getByLabel("Cost of work to be carried out by the new subcontractor").type("11");
  });

  it("Should have a 'Justification' input which will accept 2000 characters", () => {
    cy.getByLabel("Justification");
  });

  it("Should have a mark as complete section", () => {
    cy.get("legend").contains("Mark as complete");
    cy.getByLabel("I agree with this change").click();
  });
});
