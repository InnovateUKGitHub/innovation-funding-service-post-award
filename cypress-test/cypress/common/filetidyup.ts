/**
 * When clearing documents it is best to pass in the name of the user logged in.
 * The user name is next to the Remove button, so this makes the siblings() more effective
 * It also means that if there is a file uploaded by a different user for any reason it won't try and remove that one
 */
export const fileTidyUp = (name: string) => {
  cy.get("body").then($body => {
    if ($body.text().includes(name)) {
      cy.log(`Deleting existing ${name} document`);
      cy.tableCell(name).siblings().contains("button", "Remove").click({ force: true });
      cy.validationMessage("has been deleted");
    } else {
      cy.get("h2").contains("Files uploaded");
    }
  });
};

export const claimReviewFileTidyUp = (name: string) => {
  cy.getByQA("claim-supporting-documents-container").within(() => {
    cy.get("tr").then($container => {
      if ($container.text().includes(name)) {
        cy.log(`Deleting existing ${name} document`);
        cy.tableCell(name).siblings().contains("button", "Remove").click({ force: true });
        cy.wait(1000);
      }
    });
  });
};
