export const euiCostCleanUp = () => {
  cy.get("tr")
    .eq(1)
    .then($row1 => {
      if ($row1.text().includes("£1,000.00")) {
        cy.log("**Clearing cost category**");
        cy.get("a").contains("Labour").click();
        cy.heading("Labour");
        cy.clickOn("Remove");
        cy.wait(500);
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
        cy.getByAriaLabel("Cost of claim line item 0").clear().type("11500");
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
          cy.button(catName).click();
          cy.heading(catName);
          cy.button("Remove").click();
          cy.button("Save and return to claims").click();
          cy.heading("Costs to be claimed");
        } else {
          cy.heading("Costs to be claimed");
        }
      });
  });
};

export const otherCost5TidyUp = () => {
  cy.wait(2000);
  cy.get("tr")
    .eq(11)
    .then($row => {
      if ($row.text().includes("£91,001.00")) {
        cy.log("**Clearing Other costs 5**");
        cy.get("a").contains("Other costs 5").click();
        cy.heading("Other costs 5");
        cy.getByAriaLabel("Cost of claim line item 0").clear();
        cy.getByAriaLabel("Cost of claim line item 0").type("2100");
        cy.wait(500);
        cy.clickOn("Save and return to claims");
        cy.heading("Costs to be claimed");
      }
    });
};

export const forecastTidyUp = (value: string) => {
  cy.get("tr")
    .eq(14)
    .then($row => {
      if ($row.text().includes(value)) {
        cy.getByAriaLabel("Other costs 5 Period 2").clear();
        cy.getByAriaLabel("Other costs 5 Period 2").type("0");
      }
    });
};
