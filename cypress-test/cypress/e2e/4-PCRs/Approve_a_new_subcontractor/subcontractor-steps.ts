export const contractorName255 =
  "If you ever need a reason to go to the office in Swindon, consider the fact that every third wednesday of the month, Pippin's donuts comes into the office and sells its lovely goods. If you ever need a reason to go to the office in Swindon, consider the f";
export const contractorName254 =
  "If you ever need a reason to go to the office in Swindon, consider the fact that every third wednesday of the month, Pippin's donuts comes into the office and sells its lovely goods. If you ever need a reason to go to the office in Swindon, consider the f";

export const validateSubcontractorName = () => {
  cy.getByLabel("Company name of subcontractor").invoke("val", contractorName255).trigger("input");
  cy.getByLabel("Company name of subcontractor").type("{moveToEnd}").type("i");
  cy.wait(500);
  cy.button("Save and continue").click();
  cy.validationLink("Subcontractor's name must be 255 characters or less.");
  cy.getByLabel("Company name of subcontractor").type("{moveToEnd}{backspace}");
  cy.button("Save and continue").click();
  cy.getListItemFromKey("Company name of subcontractor", contractorName255);
  cy.getListItemFromKey("Company name of subcontractor", "Edit").click();
};
