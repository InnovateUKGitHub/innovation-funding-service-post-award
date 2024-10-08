let newCurrency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export const spendTableValues = (jsDisabled?: boolean) => {
  [
    "Labour Period 1",
    "Labour Period 2",
    "Labour Period 3",
    "Labour Period 4",
    "Labour Period 5",
    "Labour Period 6",
    "Labour Period 7",
    "Labour Period 8",
    "Labour Period 9",
    "Labour Period 10",
    "Labour Period 11",
    "Labour Period 12",
  ].forEach(labourInput => {
    cy.getByAriaLabel(labourInput).should("have.value", 100);
  });
  cy.wait(500);
  cy.get("td:nth-child(14)").contains("£1,200.00");
  [
    "Overheads Period 1",
    "Overheads Period 2",
    "Overheads Period 3",
    "Overheads Period 4",
    "Overheads Period 5",
    "Overheads Period 6",
    "Overheads Period 7",
    "Overheads Period 8",
    "Overheads Period 9",
    "Overheads Period 10",
    "Overheads Period 11",
    "Overheads Period 12",
  ].forEach(overheadInput => {
    cy.getByAriaLabel(overheadInput).contains(newCurrency.format(20));
    cy.get("td:nth-child(14)").contains("£120.00");
  });
  [
    "Materials Period 1",
    "Materials Period 2",
    "Materials Period 3",
    "Materials Period 4",
    "Materials Period 5",
    "Materials Period 6",
    "Materials Period 7",
    "Materials Period 8",
    "Materials Period 9",
    "Materials Period 10",
    "Materials Period 11",
    "Materials Period 12",
  ].forEach(materialsInput => {
    cy.getByAriaLabel(materialsInput).should("have.value", 25);
  });
  cy.get("td:nth-child(14)").contains("£300.00");
  [
    "Capital usage Period 1",
    "Capital usage Period 2",
    "Capital usage Period 3",
    "Capital usage Period 4",
    "Capital usage Period 5",
    "Capital usage Period 6",
    "Capital usage Period 7",
    "Capital usage Period 8",
    "Capital usage Period 9",
    "Capital usage Period 10",
    "Capital usage Period 11",
    "Capital usage Period 12",
  ].forEach(capUsageInput => {
    cy.getByAriaLabel(capUsageInput).should("have.value", 10);
  });
  cy.get("td:nth-child(14)").contains("£120.00");
  [
    "Subcontracting Period 1",
    "Subcontracting Period 2",
    "Subcontracting Period 3",
    "Subcontracting Period 4",
    "Subcontracting Period 5",
    "Subcontracting Period 6",
    "Subcontracting Period 7",
    "Subcontracting Period 8",
    "Subcontracting Period 9",
    "Subcontracting Period 10",
    "Subcontracting Period 11",
    "Subcontracting Period 12",
  ].forEach(subcontractingInput => {
    cy.getByAriaLabel(subcontractingInput).should("have.value", 5);
  });
  cy.get("td:nth-child(14)").contains("£60.00");
  [
    "Travel and subsistence Period 1",
    "Travel and subsistence Period 2",
    "Travel and subsistence Period 3",
    "Travel and subsistence Period 4",
    "Travel and subsistence Period 5",
    "Travel and subsistence Period 6",
    "Travel and subsistence Period 7",
    "Travel and subsistence Period 8",
    "Travel and subsistence Period 9",
    "Travel and subsistence Period 10",
    "Travel and subsistence Period 11",
    "Travel and subsistence Period 12",
  ].forEach(travelInput => {
    cy.getByAriaLabel(travelInput).should("have.value", 2);
  });
  cy.get("td:nth-child(14)").contains("£24.00");
  [
    "Other costs Period 1",
    "Other costs Period 2",
    "Other costs Period 3",
    "Other costs Period 4",
    "Other costs Period 5",
    "Other costs Period 6",
    "Other costs Period 7",
    "Other costs Period 8",
    "Other costs Period 9",
    "Other costs Period 10",
    "Other costs Period 11",
    "Other costs Period 12",
  ].forEach(otherInput => {
    cy.getByAriaLabel(otherInput).should("have.value", 1);
  });
  cy.get("td:nth-child(14)").contains("£12.00");
  [
    "Other costs 2 Period 1",
    "Other costs 2 Period 2",
    "Other costs 2 Period 3",
    "Other costs 2 Period 4",
    "Other costs 2 Period 5",
    "Other costs 2 Period 6",
    "Other costs 2 Period 7",
    "Other costs 2 Period 8",
    "Other costs 2 Period 9",
    "Other costs 2 Period 10",
    "Other costs 2 Period 11",
    "Other costs 2 Period 12",
  ].forEach(other2Input => {
    cy.getByAriaLabel(other2Input).should("have.value", 2000);
  });
  cy.get("td:nth-child(14)").contains("£24,000.00");
  [
    "Other costs 3 Period 1",
    "Other costs 3 Period 2",
    "Other costs 3 Period 3",
    "Other costs 3 Period 4",
    "Other costs 3 Period 5",
    "Other costs 3 Period 6",
    "Other costs 3 Period 7",
    "Other costs 3 Period 8",
    "Other costs 3 Period 9",
    "Other costs 3 Period 10",
    "Other costs 3 Period 11",
    "Other costs 3 Period 12",
  ].forEach(other3Input => {
    cy.getByAriaLabel(other3Input).should("have.value", 3000);
  });
  cy.get("td:nth-child(14)").contains("£36,000.00");
  [
    "Other costs 4 Period 1",
    "Other costs 4 Period 2",
    "Other costs 4 Period 3",
    "Other costs 4 Period 4",
    "Other costs 4 Period 5",
    "Other costs 4 Period 6",
    "Other costs 4 Period 7",
    "Other costs 4 Period 8",
    "Other costs 4 Period 9",
    "Other costs 4 Period 10",
    "Other costs 4 Period 11",
    "Other costs 4 Period 12",
  ].forEach(other4Input => {
    cy.getByAriaLabel(other4Input).should("have.value", 4000);
  });
  cy.get("td:nth-child(14)").contains("£48,000.00");
  [
    "Other costs 5 Period 1",
    "Other costs 5 Period 2",
    "Other costs 5 Period 3",
    "Other costs 5 Period 4",
    "Other costs 5 Period 5",
    "Other costs 5 Period 6",
    "Other costs 5 Period 7",
    "Other costs 5 Period 8",
    "Other costs 5 Period 9",
    "Other costs 5 Period 10",
    "Other costs 5 Period 11",
    "Other costs 5 Period 12",
  ].forEach(other5Input => {
    cy.getByAriaLabel(other5Input).should("have.value", 5000);
  });
  if (jsDisabled) {
    cy.button("Save and return to project setup").click();
    cy.heading("Project setup");
    cy.get("a").contains("Set spend profile").click();
    cy.heading("Spend Profile");
  }
  cy.get("td:nth-child(14)").contains("£60,000.00");
  [
    "td:nth-child(2)",
    "td:nth-child(3)",
    "td:nth-child(4)",
    "td:nth-child(5)",
    "td:nth-child(6)",
    "td:nth-child(7)",
    "td:nth-child(8)",
    "td:nth-child(9)",
    "td:nth-child(10)",
    "td:nth-child(11)",
    "td:nth-child(12)",
    "td:nth-child(13)",
  ].forEach(columnTotal => {
    cy.get(columnTotal).contains("£14,163.00");
  });
  cy.get("td:nth-child(14)").contains("£169,956.00");
};
