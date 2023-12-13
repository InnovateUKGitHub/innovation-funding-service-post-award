import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  statusAndCommentsAccordion,
  pcrCommentBox,
  characterCount,
  correctPcrType,
  giveUsInfoTodo,
  explainChangesReasoning,
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
});
