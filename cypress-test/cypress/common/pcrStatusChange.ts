let date = new Date();
let comments = JSON.stringify(date);

export const pcrStatusChange = (status: string) => {
  cy.get("body").then($body => {
    if ($body.text().includes(status)) {
      cy.log(`Resetting the status of PCR`);
      cy.tableCell(status).siblings().contains("Edit").click();
      cy.get("h1").contains("Request");
      cy.wait(1000);
      cy.get("textarea").clear().type(comments);
      cy.get("button").contains("Submit request").click();
      cy.get("h1").contains("Project change requests");
    } else {
      cy.get("h1").contains("Project change requests");
    }
  });
};
