let date = new Date().toUTCString();
let comments = date;

export const moClaimTidyUp = (claimType: string) => {
  cy.contains("td", "ABS EUI Medium Enterprise")
    .siblings()
    .then($tr => {
      if ($tr.text().includes(claimType)) {
        cy.log(`Change claim status of ${claimType} claim`);
        cy.switchUserTo("iuk.accproject@bjss.com.bjssdev");
        cy.get("td").contains("ABS EUI Medium Enterprise").siblings().contains("a", "Edit").click();
        cy.button("Continue to claims documents").click();
        cy.get("a").contains("Continue to update forecast").click();
        cy.button("Continue to summary").click();
        cy.submitButton("Submit claim").click();
        cy.heading("Claims");
        cy.switchUserTo("testman2@testing.com");
      } else {
        cy.switchUserTo("testman2@testing.com");
      }
    });
};

export const fcClaimTidyUp = async (claimType: string) => {
  cy.contains("td", "ABS EUI Medium Enterprise")
    .siblings()
    .then($tr => {
      if ($tr.text().includes(claimType)) {
        cy.log(`Change claim status of ${claimType} claim`);
        cy.switchUserTo("testman2@testing.com");
        cy.get("td").contains("ABS EUI Medium Enterprise").siblings().contains("a", "Review").click();
        cy.getByQA("status_MO Queried").click({ force: true });
        cy.get("textarea").clear().type(comments);
        cy.paragraph("You have");
        cy.paragraph("I am satisfied that the costs claimed appear to comply");
        cy.getByQA("cr&d-reminder").contains("You must submit a monitoring report");
        cy.submitButton("Send query").click();
        cy.heading("Claims");
        cy.backLink("Back to project").click();
        cy.heading("Project overview");
      } else {
        cy.heading("Claims");
        cy.backLink("Back to project").click();
        cy.heading("Project overview");
      }
    });
};
