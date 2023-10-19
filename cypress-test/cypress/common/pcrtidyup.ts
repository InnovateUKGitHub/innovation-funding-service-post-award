import { PcrType } from "typings/pcr";

export const pcrTidyUp = (pcrType: PcrType) => {
  cy.get("main").then($main => {
    if ($main.text().includes(pcrType)) {
      cy.log(`Deleting existing ${pcrType} PCR`);
      cy.tableCell(pcrType).siblings().contains("Delete").click();
      cy.get("button").contains("Delete request").click();
      cy.get("a").contains("Create request").click();
    } else {
      cy.get("a").contains("Create request").click();
    }
  });
};
