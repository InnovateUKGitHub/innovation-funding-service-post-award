/**
 * When clearing documents it is best to pass in the name of the user logged in.
 * The user name is next to the Remove button, so this makes the siblings() more effective
 * It also means that if there is a file uploaded by a different user for any reason it won't try and remove that one
 */
export const fileTidyUp = (name: string) => {
  cy.wait(500);
  for (let i = 1; i < 25; i++) {
    cy.get("main").then($main => {
      if ($main.text().includes(name)) {
        cy.log(`Deleting existing ${name} document`);
        cy.get("tr")
          .eq(1)
          .within(() => {
            cy.tableCell("Remove").click();
          });
        cy.validationNotification("has been removed.");
        cy.wait(3000);
      } else {
        cy.get("h2").contains("Files uploaded");
      }
    });
  }
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
