export const navigateToCostCat = (category: string, row: number) => {
  cy.get("tr")
    .eq(row)
    .within(() => {
      cy.get("td:nth-child(3)").contains("Edit").click();
      cy.get("h2").contains(category);
    });
  cy.get("a").contains("Add a cost").click();
};
