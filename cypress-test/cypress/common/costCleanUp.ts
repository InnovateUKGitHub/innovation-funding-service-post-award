export const euiCostCleanUp = () => {
  cy.get("tr")
    .eq(1)
    .then($row1 => {
      if ($row1.text().includes("£1,000.00")) {
        cy.log("**Clearing cost category**");
        cy.get("a").contains("Labour").click();
        cy.heading("Labour");
        cy.clickOn("Remove");
        cy.get("textarea").clear();
        cy.get("main").then($main => {
          if ($main.text().includes("testfile.doc")) {
            cy.button("Upload and remove documents").click();
            cy.heading("Labour documents");
            cy.clickOn("Remove");
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
        cy.clickOn("Remove");
        cy.get("textarea").clear();
        cy.button("Save and return to claims").click();
        cy.heading("Costs to be claimed");
      } else {
        cy.heading("Costs to be claimed");
      }
    });
};

export const overheadsTidyUp = () => {
  cy.get("tr")
    .eq(2)
    .then($tr2 => {
      if ($tr2.text().includes("£200.00")) {
        cy.get("a").contains("Overheads").click();
        cy.heading("Overheads");
        cy.clickOn("Remove");
        cy.button("Save and return to claims").click();
        cy.heading("Costs to be claimed");
      } else {
        cy.heading("Costs to be claimed");
      }
    });
};

export const loansProjCostCleanUp = () => {
  cy.get("tr")
    .eq(1)
    .then($row1 => {
      if ($row1.text().includes("£11,400.00")) {
        cy.log("**Clearing cost category**");
        cy.get("a").contains("Loans costs for Industrial participants").click();
        cy.heading("Loans costs for Industrial participants");
        cy.get("#value0").clear().type("11500");
        cy.wait(500);
        cy.button("Save and return to project costs").click();
        cy.heading("Costs for this period");
      } else {
        cy.heading("Costs for this period");
      }
    });
};

export const retentionTidyUp = () => {
  [
    ["1", "Labour"],
    ["3", "Materials"],
    ["5", "Subcontracting"],
  ].forEach(([rowNum, catName]) => {
    cy.get("tr")
      .eq(Number(rowNum))
      .then($row => {
        if ($row.text().includes("£5,001.00")) {
          cy.log("**Clearing cost category**");
          cy.get("a").contains(catName).click();
          cy.heading(catName);
          cy.get("a").contains("Remove").click();
          cy.get("button").contains("Save and return to claims").click();
          cy.heading("Costs to be claimed");
        } else {
          cy.heading("Costs to be claimed");
        }
      });
  });
};
