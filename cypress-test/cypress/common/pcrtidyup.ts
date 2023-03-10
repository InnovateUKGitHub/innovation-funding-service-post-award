export const pcrTidyUp = (pcrType: string) => {
  cy.get("body").then($body => {
    if ($body.text().includes(pcrType)) {
      cy.log(`Deleting existing ${pcrType} PCR`);
      cy.tableCell(pcrType).siblings().contains("a", "Delete").click();
      cy.submitButton("Delete request").click();
      cy.get("a").contains("Create request").click();
    } else {
      cy.get("a").contains("Create request").click();
    }
  });
};
