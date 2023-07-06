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
    "£575,000.00",
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
  cy.get("h4").contains("Partner finance details");
  [
    ["EUI Small Ent Health (Lead)", "£350,000.00", "65.00%", "£0.00", "£227,500.00", "£0.00", "80.00%", "£0.00"],
    ["A B Cad Services", "£175,000.00", "65.00%", "£0.00", "£113,750.00", "0.00", "80.00%", "£0.00"],
    ["ABS EUI Medium Enterprise", "£50,000.00", "65.00%", "£26,000.00", "£6,500.00", "£0.00", "80.00%", "£9,000.00"],
  ].forEach(
    (
      [
        participant,
        eligibleCosts,
        fundingLevel,
        totalApproved,
        remainingGrant,
        paidInAdvance,
        claimCap,
        claimRetention,
      ],
      rowNumber = 0,
    ) => {
      cy.getByQA("PartnerFinanceDetails")
        .find("tr")
        .eq(rowNumber + 1)
        .within(() => {
          cy.get("td:nth-child(1)").contains(participant);
          cy.get("td:nth-child(2)").contains(eligibleCosts);
          cy.get("td:nth-child(3)").contains(fundingLevel);
          cy.get("td:nth-child(4)").contains(totalApproved);
          cy.get("td:nth-child(5)").contains(remainingGrant);
          cy.get("td:nth-child(6)").contains(paidInAdvance);
          cy.get("td:nth-child(7)").contains(claimCap);
          cy.get("td:nth-child(8)").contains(claimRetention);
        });
    },
  );
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
  ].forEach(manyIarRequirement => {
    cy.getByQA("WhenAnIarIsNeeded").contains("td:nth-child(1)", manyIarRequirement);
  });
  [
    "Never, for this project",
    "With the first and last claim only",
    "With the last claim only",
    "With the first claim, last claim and on every anniversary of the project start date",
    "Quarterly",
  ];
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

export const partnerFinanceHeaders = () => {
  [
    "Total eligible costs",
    "Funding level",
    "Total grant approved",
    "Remaining grant",
    "Total grant paid in advance",
    "Claim cap",
  ].forEach(headers => {
    cy.getByQA("PartnerFinanceDetails").contains("th", headers);
  });
};

export const partnerFinanceEligibleCosts = () => {
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
  ].forEach(manyProjCost => {
    cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(2)", manyProjCost);
  });
};

export const partnerFinanceFundingLevel = () => {
  [
    "65.00%",
    "66.00%",
    "67.00%",
    "68.00%",
    "69.00%",
    "70.00%",
    "71.00%",
    "72.00%",
    "73.00%",
    "74.00%",
    "75.00%",
    "76.00%",
    "77.00%",
    "78.00%",
    "79.00%",
    "80.00%",
    "81.00%",
    "82.00%",
    "83.00%",
    "84.00%",
    "85.00%",
    "86.00%",
    "87.00%",
    "88.00%",
    "89.00%",
    "90.00%",
    "91.00%",
    "92.00%",
    "93.00%",
    "94.00%",
    "95.00%",
    "96.11%",
  ].forEach(fundLevel => {
    cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(3)", fundLevel);
  });
};

export const partnerFinanceRemainingGrant = () => {
  [
    "£247,650.00",
    "£254,760.00",
    "£257,950.00",
    "£259,080.00",
    "£267,181.80",
    "£294,000.00",
    "£275,480.00",
    "£25,200.00",
    "£284,700.00",
    "£307,840.00",
    "£291,750.00",
    "£314,640.00",
    "£308,000.00",
    "£208,385.19",
    "£797,900.00",
    "£297,600.00",
    "£445,500.00",
    "£324,720.00",
    "£294,650.00",
    "£378,000.00",
    "£374,000.00",
    "£331,100.00",
    "£351,480.00",
    "£366,080.00",
    "£373,800.00",
    "£371,700.00",
    "£327,600.00",
    "£432,400.00",
    "£451,050.00",
    "£403,260.00",
    "£369,550.00",
    "£706,408.50",
  ].forEach(remaining => {
    cy.getByQA("PartnerFinanceDetails").contains("td:nth-child(5)", remaining);
  });
};
