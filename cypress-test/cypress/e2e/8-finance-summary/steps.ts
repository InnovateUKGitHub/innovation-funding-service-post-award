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

export const manyPartnerSummary = () => {
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
  ].forEach(manyPartnerCost => {
    cy.getByQA("ProjectCostsToDate").contains("td:nth-child(1)", manyPartnerCost);
  });
  cy.get("h3").contains("Project costs to date");
};

export const eligibleCostsSummary = () => {
  [
    "£384,000.00",
    "£386,000.00",
    "£385,000.00",
    "£381,000.00",
    "£387,220.00",
    "£420,000.00",
    "£388,000.00",
    "£35,000.00",
    "£390,000.00",
    "£416,000.00",
    "£389,000.00",
    "£414,000.00",
    "£400,000.00",
    "£267,160.50",
    "£1,010,000.00",
    "£372,000.00",
    "£550,000.00",
    "£396,000.00",
    "£355,000.00",
    "£450,000.00",
    "£440,000.00",
    "£385,000.00",
    "£404,000.00",
    "£416,000.00",
    "£420,000.00",
    "£413,000.00",
    "£360,000.00",
    "£470,000.00",
    "£485,000.00",
    "£429,000.00",
    "£389,000.00",
    "£735,000.00",
    "£13,521,380.50",
  ].forEach(manyProjCost => {
    cy.getByQA("ProjectCostsToDate").contains("td:nth-child(2)", manyProjCost);
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
  ].forEach(manyPartnerCost => {
    cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(1)", manyPartnerCost);
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

export const projCostsHeaders = () => {
  [
    "Totals",
    "Total eligible costs",
    "Eligible costs claimed to date",
    "Percentage of eligible costs claimed to date",
    "Totals",
  ].forEach(header => {
    cy.getByQA("ProjectCostsToDate").contains("th", header);
  });
};
