export const moClaimTidyUp = (claimType: string) => {
  cy.contains("td", "ABS EUI Medium Enterprise")
    .siblings()
    .then($tr => {
      if ($tr.text().includes(claimType)) {
        cy.log(`Change claim status of ${claimType} claim`);
        cy.switchUserTo("iuk.accproject@bjss.com.bjssdev");
        cy.get("td").contains("ABS EUI Medium Enterprise").siblings().contains("a", "Edit").click();
        cy.get("button").contains("Continue to claims documents").click();
        cy.get("a").contains("Continue to update forecast").click();
        cy.get("button").contains("Continue to summary").click();
        cy.submitButton("Submit claim").click();
        cy.get("h1").contains("Claims");
        cy.switchUserTo("testman2@testing.com");
      } else {
        cy.switchUserTo("testman2@testing.com");
      }
    });
};
