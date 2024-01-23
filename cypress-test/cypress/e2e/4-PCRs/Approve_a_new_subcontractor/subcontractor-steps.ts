import { loremIpsum255Char, loremIpsum254Char } from "common/lorem";

export const validateSubcontractorName = () => {
  cy.getByLabel("Company name of subcontractor").invoke("val", loremIpsum255Char).trigger("input");
  cy.button("Save and continue").click();
  cy.validationLink("Subcontractor's name must be 255 characters or less.");
  cy.getByLabel("Company name of subcontractor").type("{moveToEnd}{backspace}");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Company name of subcontractor", loremIpsum254Char);
  cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
};
