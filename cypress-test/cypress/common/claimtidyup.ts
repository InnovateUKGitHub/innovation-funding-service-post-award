export const claimTidyUp = (claimType: string) => {
  cy.get("body").then($body => {
    if ($body.text().includes(claimType)) {
      cy.log(`Change claim status of ${claimType} claim`);
      cy.tableCell(claimType).siblings().contains("a", "Edit").click();
      cy.getByQA("button_default-qa").click();
      cy.get("a").contains("Continue to update forecast").click();
      cy.getByQA("button_default-qa").contains("Continue to summary").click();
      cy.getByQA("button_default-qa").contains("Submit claim").click();
      cy.get("h1").contains("Claims");
    } else {
      cy.switchUserTo("testman2@testing.com");
    }
  });
};
