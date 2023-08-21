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

export const manyPartnerAndEligibleCostsSummary = () => {
  [
    ["EUI Small Ent Health", "£384,000.00"],
    ["A B Cad Services", "£386,000.00"],
    ["ABS EUI Medium Enterprise", "£385,000.00"],
    ["Auto Corporation Ltd", "£381,000.00"],
    ["Auto Healthcare Ltd", "£387,220.00"],
    ["Auto Monitoring Ltd", "£420,000.00"],
    ["Auto Research Ltd", "£388,000.00"],
    ["Brown and co", "£35,000.00"],
    ["Deep Rock Galactic", "£390,000.00"],
    ["EUI Micro Research Co.", "£416,000.00"],
    ["Gorcium Management Services Ltd.", "£389,000.00"],
    ["Hedges' Hedges Ltd", "£414,000.00"],
    ["Hyperion Corporation", "£400,000.00"],
    ["Image Development Society", "£267,160.50"],
    ["Intaser", "£1,010,000.00"],
    ["Jakobs", "£372,000.00"],
    ["Java Coffee Inc", "£550,000.00"],
    ["Lutor Systems", "£396,000.00"],
    ["Maliwan", "£355,000.00"],
    ["Munce Inc", "£450,000.00"],
    ["National Investment Bank", "£440,000.00"],
    ["NIB Reasearch Limited", "£385,000.00"],
    ["RBA Test Account 1", "£404,000.00"],
    ["Red Motor Research Ltd.", "£416,000.00"],
    ["Swindon Development University", "£420,000.00"],
    ["Swindon University", "£413,000.00"],
    ["The Best Manufacturing", "£360,000.00"],
    ["Top Castle Co.", "£470,000.00"],
    ["UAT37", "£485,000.00"],
    ["University of Bristol", "£429,000.00"],
    ["Vitruvius Stonework Limited", "£389,000.00"],
    ["YHDHDL", "£735,000.00"],
    ["Totals", "£13,521,380.50"],
  ].forEach(([partner, totalEligibleCosts]) => {
    cy.getByQA("ProjectCostsToDate")
      .contains(partner !== "Totals" ? "td:nth-child(1)" : "th:nth-child(1)", partner)
      .next()
      .contains(totalEligibleCosts);
  });
  cy.get("h3").contains("Project costs to date");
};

export const partnerFinanceDetails = () => {
  cy.get("h3").contains("Partner finance details");
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
    ["EUI Small Ent Health", "£384,000.00", "65.00%", "£247,650.00"],
    ["A B Cad Services", "£386,000.00", "66.00%", "£254,760.00"],
    ["ABS EUI Medium Enterprise", "£385,000.00", "67.00%", "£257,950.00"],
    ["Auto Corporation Ltd", "£381,000.00", "68.00%", "£259,080.00"],
    ["Auto Healthcare Ltd", "£387,220.00", "69.00%", "£267,181.80"],
    ["Auto Monitoring Ltd", "£420,000.00", "70.00%", "£294,000.00"],
    ["Auto Research Ltd", "£388,000.00", "71.00%", "£275,480.00"],
    ["Brown and co", "£35,000.00", "72.00%", "£25,200.00"],
    ["Deep Rock Galactic", "£390,000.00", "73.00%", "£284,700.00"],
    ["EUI Micro Research Co.", "£416,000.00", "74.00%", "£307,840.00"],
    ["Gorcium Management Services Ltd.", "£389,000.00", "75.00%", "£291,750.00"],
    ["Hedges' Hedges Ltd", "£414,000.00", "76.00%", "£314,640.00"],
    ["Hyperion Corporation", "£400,000.00", "77.00%", "£308,000.00"],
    ["Image Development Society", "£267,160.50", "78.00%", "£208,385.19"],
    ["Intaser", "£1,010,000.00", "79.00%", "£797,900.00"],
    ["Jakobs", "£372,000.00", "80.00%", "£297,600.00"],
    ["Java Coffee Inc", "£550,000.00", "81.00%", "£445,500.00"],
    ["Lutor Systems", "£396,000.00", "82.00%", "£324,720.00"],
    ["Maliwan", "£355,000.00", "83.00%", "£294,650.00"],
    ["Munce Inc", "£450,000.00", "84.00%", "£378,000.00"],
    ["National Investment Bank", "£440,000.00", "85.00%", "£374,000.00"],
    ["NIB Reasearch Limited", "£385,000.00", "86.00%", "£331,100.00"],
    ["RBA Test Account 1", "£404,000.00", "87.00%", "£351,480.00"],
    ["Red Motor Research Ltd.", "£416,000.00", "88.00%", "£366,080.00"],
    ["Swindon Development University", "£420,000.00", "89.00%", "£373,800.00"],
    ["Swindon University", "£413,000.00", "90.00%", "£371,700.00"],
    ["The Best Manufacturing", "£360,000.00", "91.00%", "£327,600.00"],
    ["Top Castle Co.", "£470,000.00", "92.00%", "£432,400.00"],
    ["UAT37", "£485,000.00", "93.00%", "£451,050.00"],
    ["University of Bristol", "£429,000.00", "94.00%", "£403,260.00"],
    ["Vitruvius Stonework Limited", "£389,000.00", "95.00%", "£369,550.00"],
    ["YHDHDL", "£735,000.00", "96.11%", "£706,408.50"],
  ].forEach(([partnerName, totalEligibleCosts, fundingLevel, remainingGrant], row) => {
    cy.getByQA("PartnerFinanceDetails").within(() => {
      cy.get("tr")
        .eq(row + 1)
        .within(() => {
          cy.contains("td:nth-child(1)", partnerName);
          cy.contains("td:nth-child(2)", totalEligibleCosts);
          cy.contains("td:nth-child(3)", fundingLevel);
          cy.contains("td:nth-child(5)", remainingGrant);
        });
    });
  });
  cy.get("h3").contains("Partner finance details");
};

export const whenIarNeeded = () => {
  [
    "EUI Small Ent Health (Lead)",
    "A B Cad Services",
    "ABS EUI Medium Enterprise",
    "Never, for this project",
    "Quarterly",
  ].forEach(iarRequirement => {
    cy.getByQA("WhenAnIarIsNeeded").contains(iarRequirement);
  });
  cy.get("h3").contains("When an independent accountant's report is needed");
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
    "Hedges' Hedges Ltd",
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
  cy.get("h3").contains("When an independent accountant's report is needed");
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

export const dashboardAsFC = () => {
  cy.heading("Project overview");
  cy.getByQA("section-content").contains("A B Cad Services costs to date");
};

export const fcValidateCostsToDate = () => {
  cy.getByQA("claims-totals-col-0-gol-costs").contains("Total eligible costs");
  cy.getByQA("claims-totals-col-0-gol-costs").contains("£175,000.00");
  cy.getByQA("claims-totals-col-0-claimed-costs").contains("Eligible costs claimed to date");
  cy.getByQA("claims-totals-col-0-claimed-costs").contains("£0.00");
  cy.getByQA("claims-totals-col-0-percentage-costs").contains("Percentage of eligible costs claimed to date");
  cy.getByQA("claims-totals-col-0-percentage-costs").contains("0.00%");
};

export const fcValidateCostsCheckForPartners = () => {
  cy.get("h3").contains("Project costs to date");
  let child = 0;
  ["A B Cad Services", "£175,000.00", "£0.00", "0.00%"].forEach(cell => {
    cy.getByQA("ProjectCostsToDate")
      .eq(0)
      .within(() => {
        child++;
        cy.get("td:nth-child(" + child + ")").contains(cell);
      });
  });
  cy.getByQA("ProjectCostsToDate").within(() => {
    cy.tableCell("EUI Small Ent Health (Lead)").should("not.exist");
    cy.tableCell("ABS EUI Medium Enterprise").should("not.exist");
  });
};

export const fcValidateFinancesCheckForPartners = () => {
  cy.get("h3").contains("Partner finance details");
  ["A B Cad Services", "£175,000.00", "65.00%", "£0.00", "£113,750.00", "£0.00", "80.00%", "£0.00"].forEach(
    (cell, index) => {
      cy.getByQA("PartnerFinanceDetails")
        .eq(0)
        .within(() => {
          cy.get(`td:nth-child(${index + 1})`).contains(cell);
        });
    },
  );
  cy.getByQA("ProjectCostsToDate").within(() => {
    cy.tableCell("EUI Small Ent Health (Lead)").should("not.exist");
    cy.tableCell("ABS EUI Medium Enterprise").should("not.exist");
  });
};

export const fcValidateIARCheckForPartners = () => {
  cy.get("h3").contains("When an independent accountant's report is needed");
  cy.getByQA("WhenAnIarIsNeeded").contains("A B Cad Services");
  cy.getByQA("WhenAnIarIsNeeded").contains("Quarterly");
  cy.getByQA("WhenAnIarIsNeeded").within(() => {
    cy.tableCell("EUI Small Ent Health (Lead)").should("not.exist");
    cy.tableCell("ABS EUI Medium Enterprise").should("not.exist");
  });
};
