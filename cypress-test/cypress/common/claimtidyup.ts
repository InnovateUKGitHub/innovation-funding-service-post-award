let date = new Date().toUTCString();
let comments = date;

export const moClaimTidyUp = (claimType: string) => {
  cy.contains("td", "ABS EUI Medium Enterprise")
    .siblings()
    .then($tr => {
      if ($tr.text().includes(claimType)) {
        cy.log(`Change claim status of ${claimType} claim`);
        cy.switchUserTo("iuk.accproject@bjss.com.bjssdev");
        cy.get("td").contains("ABS EUI Medium Enterprise").siblings().clickOn("a", "Edit");
        cy.clickOn("Continue to claims documents");
        cy.clickOn("Continue to update forecast");
        cy.clickOn("Continue to summary");
        cy.clickOn("Submit claim");
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
        cy.get("td").contains("ABS EUI Medium Enterprise").siblings().clickOn("a", "Review");
        cy.getByQA("status_MO Queried").click({ force: true });
        cy.get("textarea").clear();
        cy.get("textarea").type(comments);
        cy.paragraph("You have");
        cy.paragraph("I am satisfied that the costs claimed appear to comply");
        cy.getByQA("cr&d-reminder").contains("You must submit a monitoring report");
        cy.clickOn("Send query");
        cy.heading("Claims");
        cy.clickOn("Back to project");
        cy.heading("Project overview");
      } else {
        cy.heading("Claims");
        cy.clickOn("Back to project");
        cy.heading("Project overview");
      }
    });
};
