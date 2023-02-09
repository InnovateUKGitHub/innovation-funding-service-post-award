var currentYear = new Date();
var thisYear = currentYear.getFullYear();

export const projCostsToDate = () => {
  [
    "EUI Small Ent Health (Lead)",
    "A B Cad Services",
    "ABS EUI Medium Enterprise",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Percentage of eligible costs claimed to date",
    "£350,000.00",
    "£175,000.00",
    "£525,000.00",
    "Totals",
    "0.00%",
  ].forEach(projCost => {
    cy.getByQA("ProjectCostsToDate").contains(projCost);
  });
  cy.get("h3").contains("Project costs to date");
};

export const partnerFinanceDetails = () => {
  [
    "EUI Small Ent Health (Lead)",
    "A B Cad Services",
    "ABS EUI Medium Enterprise",
    "Total eligible costs",
    "Funding level",
    "Total grant approved",
    "Remaining grant",
    "Total grant paid in advance",
    "Claim cap",
    "£350,000.00",
    "£175,000.00",
    "65.00%",
    "80.00%",
  ].forEach(partnerCost => {
    cy.getByQA("PartnerFinanceDetails").contains(partnerCost);
  });
  cy.get("h4").contains("Partner finance details");
};

export const whenIarNeeded = () => {
  ["EUI Small Ent Health (Lead)", "A B Cad Services", "ABS EUI Medium Enterprise", "Never, for this project"].forEach(
    iarRequirement => {
      cy.getByQA("WhenAnIarIsNeeded").contains(iarRequirement);
    },
  );
  cy.get("h4").contains("When an independent accountant's report is needed");
};

export const periodSubWithDate = () => {
  cy.get("h2").contains("Project period");
  cy.get("span").contains(thisYear);
};
