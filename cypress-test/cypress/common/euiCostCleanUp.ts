export const euiCostCleanUp = () => {
  cy.get("tr")
    .eq(1)
    .then($row1 => {
      if ($row1.text().includes("£1,000.00")) {
        cy.log("**Clearing cost category**");
        cy.get("a").contains("Labour").click();
        cy.heading("Labour");
        cy.get("a").contains("Remove").click();
        cy.get("textarea").clear();
        cy.get("main").then($main => {
          if ($main.text().includes("testfile.doc")) {
            cy.button("Upload and remove documents").click();
            cy.heading("Labour documents");
            cy.button("Remove").click();
            cy.validationNotification("has been removed");
            cy.backLink("Back to Labour").click();
            cy.heading("Labour");
          } else {
            cy.heading("Labour");
          }
        });
        cy.button("Save and return to claims").click();
        cy.heading("Costs to be claimed");
        cy.get("a").contains("Overheads").click();
        cy.heading("Overheads");
        cy.get("a").contains("Remove").click();
        cy.get("textarea").clear();
        cy.button("Save and return to claims").click();
        cy.heading("Costs to be claimed");
      } else {
        cy.heading("Costs to be claimed");
      }
    });
};
