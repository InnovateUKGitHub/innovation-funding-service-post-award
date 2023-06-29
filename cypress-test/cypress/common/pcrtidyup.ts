import { PcrType } from "typings/pcr";

export const pcrTidyUp = (pcrType: PcrType) => {
  cy.get("body").then($body => {
    if ($body.text().includes(pcrType)) {
      cy.log(`Deleting existing ${pcrType} PCR`);
      cy.tableCell(pcrType).siblings().contains("Delete").click();
      cy.get("button").contains("Delete request").click();
      cy.get("a").contains("Create request").click();
    } else {
      cy.get("a").contains("Create request").click();
    }
  });
};
