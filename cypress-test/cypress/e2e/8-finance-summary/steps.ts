let currentYear = new Date();
let thisYear = currentYear.getFullYear();

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

export const manyProjCostsToDate = () => {
  [
    "EUI Small Ent Health",
    "A B Cad Services",
    "ABS EUI Medium Enterprise",
    "Auto Corporation Ltd",
    "Auto Healthcare Ltd",
    "Auto Monitoring Ltd",
    "Auto Research Ltd",
    "Brown and co",
    "Deep Rock Galactic",
    "EUI Micro Research Co.",
    "Gorcium Management Services Ltd.",
    "Hyperion Corporation",
    "Image Development Society",
    "Intaser",
    "Jakobs",
    "Java Coffee Inc",
    "Lutor Systems",
    "Maliwan",
    "Munce Inc",
    "National Investment Bank",
    "NIB Reasearch Limited",
    "RBA Test Account 1",
    "Red Motor Research Ltd.",
    "Swindon Development University",
    "Swindon University",
    "The Best Manufacturing",
    "Top Castle Co.",
    "UAT37",
    "University of Bristol",
    "Vitruvius Stonework Limited",
    "YHDHDL",
    "Hedges' Hedges Ltd",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Percentage of eligible costs claimed to date",
    "£350,000.00",
    "£177,500.00",
    "£1,000,000.00",
    "50.71%",
    "Totals",
    "0.00%",
  ].forEach(manyProjCost => {
    cy.getByQA("ProjectCostsToDate").contains(manyProjCost);
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

export const manyPartnerFinanceDetails = () => {
  [
    "EUI Small Ent Health",
    "A B Cad Services",
    "ABS EUI Medium Enterprise",
    "Auto Corporation Ltd",
    "Auto Healthcare Ltd",
    "Auto Monitoring Ltd",
    "Auto Research Ltd",
    "Brown and co",
    "Deep Rock Galactic",
    "EUI Micro Research Co.",
    "Gorcium Management Services Ltd.",
    "Hyperion Corporation",
    "Image Development Society",
    "Intaser",
    "Jakobs",
    "Java Coffee Inc",
    "Lutor Systems",
    "Maliwan",
    "Munce Inc",
    "National Investment Bank",
    "NIB Reasearch Limited",
    "RBA Test Account 1",
    "Red Motor Research Ltd.",
    "Swindon Development University",
    "Swindon University",
    "The Best Manufacturing",
    "Top Castle Co.",
    "UAT37",
    "University of Bristol",
    "Vitruvius Stonework Limited",
    "YHDHDL",
    "Hedges' Hedges Ltd",
    "Total eligible costs",
    "Funding level",
    "Total grant approved",
    "Remaining grant",
    "Total grant paid in advance",
    "Claim cap",
    "£350,000.00",
    "65.00%",
    "£0.00",
    "£227,500.00",
    "80.00%",
    "85.00%",
    "£1,000,000.00",
  ].forEach(manyPartnerCost => {
    cy.getByQA("PartnerFinanceDetails").contains(manyPartnerCost);
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

export const manyWhenIarNeeded = () => {
  [
    "EUI Small Ent Health",
    "A B Cad Services",
    "ABS EUI Medium Enterprise",
    "Auto Corporation Ltd",
    "Auto Healthcare Ltd",
    "Auto Monitoring Ltd",
    "Auto Research Ltd",
    "Brown and co",
    "Deep Rock Galactic",
    "EUI Micro Research Co.",
    "Gorcium Management Services Ltd.",
    "Hyperion Corporation",
    "Image Development Society",
    "Intaser",
    "Jakobs",
    "Java Coffee Inc",
    "Lutor Systems",
    "Maliwan",
    "Munce Inc",
    "National Investment Bank",
    "NIB Reasearch Limited",
    "RBA Test Account 1",
    "Red Motor Research Ltd.",
    "Swindon Development University",
    "Swindon University",
    "The Best Manufacturing",
    "Top Castle Co.",
    "UAT37",
    "University of Bristol",
    "Vitruvius Stonework Limited",
    "Hedges' Hedges Ltd",
    "Never, for this project",
  ].forEach(manyIarRequirement => {
    cy.getByQA("WhenAnIarIsNeeded").contains(manyIarRequirement);
  });
  cy.get("h4").contains("When an independent accountant's report is needed");
};

export const periodSubWithDate = () => {
  cy.get("h2").contains("Project period");
  cy.get("span").contains(thisYear);
};
