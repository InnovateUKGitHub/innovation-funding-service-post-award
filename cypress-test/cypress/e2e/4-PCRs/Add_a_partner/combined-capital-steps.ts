import { pcrArray } from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

export const accessCcProjectNavToPcr = () => {
  cy.navigateToProject("401856");
  cy.selectTile("Project change requests");
  cy.heading("Project change requests");
  pcrTidyUp("Add a partner");
};

export const correctPcrTypes = () => {
  pcrArray.forEach(pcrType => {
    cy.getByLabel(pcrType);
  });
  ["Unknown PCR Type", "Loan Drawdown Change", "Change Loans Duration"].forEach(wrongPcr => {
    cy.get("label").should("not.contain", wrongPcr);
  });
};

export const checkCcAddPartnerCompleteCosts = () => {
  [
    ["R & D labour", "£50,000.00"],
    ["R & D overheads", "£10,000.00"],
    ["R & D materials", "£500.00"],
    ["R & D subcontracting", "£2,000.00"],
    ["R & D travel and subsistence", "£200.00"],
    ["R & D capital usage", "£750.00"],
    ["R & D other costs", "£100.00"],
    ["Capital purchase (inf)", "£100.00"],
    ["Property capital costs (inf)", "£100.00"],
    ["Capitalised labour (inf)", "£100.00"],
    ["Other capital costs (inf)", "£100.00"],
    ["Capital purchase (other)", "£100.00"],
    ["Property capital costs (other)", "£100.00"],
    ["Capitalised labour (other)", "£100.00"],
    ["Other capital costs (other)", "£100.00"],
  ].forEach(([cat, value]) => {
    cy.contains("tr", cat).within(() => {
      cy.tableCell(value);
    });
  });
  cy.contains("tr", "Total costs (£)").within(() => {
    cy.tableHeader("£64,350.00");
  });
};

export const accessCcCostCat = (costcat: string) => {
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("Edit").click();
  });
  cy.get("h2").contains(costcat);
};

export const labourLineAdd = (costcat: string) => {
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains(costcat);
  cy.getByLabel("Role within project").type("Law keeper");
  cy.getByLabel("Gross employee cost").clear().type("50000");
  cy.getByLabel("Rate").clear().type("500");
  cy.getByLabel("Days to be spent by all staff with this role").clear().type("100");
  cy.paragraph("£50,000.00");
  cy.inputPrefix("£", 2);
  cy.inputSuffix("per day", 1);
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains(costcat);
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£50,000.00");
  });
};

export const overheadsLineAdd = (costcat: string) => {
  cy.get("h2").contains(costcat);
  cy.getByLabel("20%").click();
  cy.paragraph("£10,000.00");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£10,000.00");
  });
};

export const materialsLineAdd = (costcat: string) => {
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains(costcat);
  cy.getByLabel("Item").clear().type("Nails");
  cy.getByLabel("Quantity").clear().type("1000");
  cy.getByLabel("Cost per item").clear().type("0.50");
  cy.paragraph("£500.00");
  cy.inputPrefix("£", 1);
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains(costcat);
  cy.clickOn("Save and return to project costs");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£500.00");
  });
};

export const subcontractingLineAdd = (costcat: string) => {
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains(costcat);
  cy.getByLabel("Subcontractor name").clear().type("Big ben's builders");
  cy.getByLabel("Country where the subcontractor will work").clear().type("UK");
  cy.getByLabel("Role of the the subcontractor in the project and description of the work they will do")
    .clear()
    .type("building");
  cy.getByLabel("Cost").type("2000");
  cy.inputPrefix("£", 1);
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains(costcat);
  cy.clickOn("Save and return to project costs");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£2,000.00");
  });
};

export const travelAndSubLineAdd = (costcat: string) => {
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains(costcat);
  cy.getByLabel("Purpose of journey or description of subsistence cost").clear().type("collecting pizza");
  cy.getByLabel("Number of times").clear().type("2");
  cy.getByLabel("Cost of each").clear().type("100");
  cy.paragraph("£200.00");
  cy.inputPrefix("£", 1);
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains(costcat);
  cy.clickOn("Save and return to project costs");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£200.00");
  });
};

export const capUsageLineAdd = (costcat: string) => {
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains(costcat);
  cy.getByLabel("Item description").clear().type("Laptops");
  cy.getByLabel("New").click();
  cy.getByLabel("Depreciation period").clear().type("12");
  cy.getByLabel("Net present value").clear().type("4000");
  cy.getByLabel("Residual value at end of project").clear().type("1000");
  cy.getByLabel("Utilisation").clear().type("25");
  cy.paragraph("£750.00");
  cy.inputPrefix("£", 2);
  ["%", "months"].forEach(suffix => {
    cy.inputSuffix(suffix, 2);
  });
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains(costcat);
  cy.clickOn("Save and return to project costs");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£750.00");
  });
};

export const otherCostsLineAdd = (costcat: string) => {
  cy.get("a").contains("Add a cost").click();
  cy.get("h2").contains(costcat);
  cy.getByLabel("Description and justification of the cost").clear().type("D&D books for morale");
  cy.getByLabel("Estimated cost").clear().type("100");
  cy.inputPrefix("£", 1);
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains(costcat);
  cy.clickOn("Save and return to project costs");
  cy.contains("tr", costcat).within(() => {
    cy.tableCell("£100.00");
  });
};

export const addCcCostCatItem = (costcat: string, type: string) => {
  if (type.includes("labour")) {
    labourLineAdd(costcat);
  } else if (type.includes("overheads")) {
    overheadsLineAdd(costcat);
  } else if (type.includes("materials")) {
    materialsLineAdd(costcat);
  } else if (type.includes("subcontracting")) {
    subcontractingLineAdd(costcat);
  } else if (type.includes("travelAndSub")) {
    travelAndSubLineAdd(costcat);
  } else if (type.includes("capusage")) {
    capUsageLineAdd(costcat);
  } else if (type.includes("otherCosts")) {
    otherCostsLineAdd(costcat);
  }
};

export const updateLabourCheckOH = () => {
  accessCcCostCat("R & D labour");
  cy.get("a").contains("Edit").click();
  cy.get("h2").contains("R & D labour");
  cy.getByLabel("Role within project").should("have.value", "Law keeper");
  cy.getByLabel("Gross employee cost").should("have.value", "50000");
  cy.getByLabel("Rate").should("have.value", "500");
  cy.getByLabel("Days to be spent by all staff with this role").should("have.value", "100");
  cy.paragraph("£50,000.00");
  cy.getByLabel("Days to be spent by all staff with this role").clear().type("200");
  cy.paragraph("£100,000.00");
  cy.get("main").within(() => {
    cy.submitButton("Save and return").click();
  });
  cy.get("h2").contains("R & D labour");
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.contains("tr", "R & D labour").within(() => {
    cy.tableCell("£100,000.00");
  });
  cy.contains("tr", "R & D overheads").within(() => {
    cy.tableCell("£20,000.00");
  });
};

export const updateOverheadsCalculated = () => {
  accessCcCostCat("R & D overheads");
  cy.getByLabel("Calculated").click();
  cy.getByLabel("Total cost of overheads as calculated in the spreadsheet").clear().type("66666");
  cy.paragraph("£66,666.00");
  cy.inputPrefix("£", 1);
  cy.button("Calculate overheads documents").click();
  cy.get("h2").contains("Calculate overheads");
  cy.fileInput("testfile.doc");
  cy.button("Upload documents").click();
  cy.validationNotification("Your document has been uploaded.");
  cy.tableCell("testfile.doc");
  cy.button("Save and return to overheads costs").click();
  cy.get("h2").contains("R & D overheads");
  cy.getByLabel("Calculated").should("have.attr", "checked");
  cy.tableCell("testfile.doc");
  cy.getByLabel("Total cost of overheads as calculated in the spreadsheet").should("have.value", "66666");
  cy.inputPrefix("£", 1);
  cy.paragraph("£66,666.00");
  cy.button("Save and return to project costs").click();
  cy.get("h2").contains("Project costs for new partner");
  cy.contains("tr", "R & D overheads").within(() => {
    cy.tableCell("£66,666.00");
  });
};

export const deleteLabourRemoveOH = () => {
  accessCcCostCat("R & D labour");
  cy.get("a").contains("Remove").click();
  cy.get("h2").contains("Delete r & d labour");
  [
    ["Role within project", "Law keeper"],
    ["Gross employee cost", "£50,000.00"],
    ["Rate", "£500.00"],
    ["Days to be spent by all staff with this role", "200"],
    ["Total cost", "£100,000.00"],
  ].forEach(([item, cost]) => {
    cy.getListItemFromKey(item, cost);
  });
  cy.button("Delete cost").click();
  cy.get("h2").contains("R & D labour");
  cy.contains("tr", "Total r & d labour").within(() => {
    cy.tableHeader("£0.00");
  });
  cy.clickOn("Save and return to project costs");
  cy.get("h2").contains("Project costs for new partner");
  cy.contains("tr", "R & D labour").within(() => {
    cy.tableCell("£0.00");
  });
  cy.contains("tr", "R & D overheads").within(() => {
    cy.tableCell("£66,666.00");
  });
};
