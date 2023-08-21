const fs = require("fs");

export const createTestFile = (name: string, size: number) => {
  cy.writeFile(`cypress/common/${name}.txt`, Buffer.alloc(size * 1024 * 1024, "0"), { timeout: 1800000 });
};

export const deleteTestFile = (name: string) => {
  cy.task("deleteFile", `cypress/common/${name}.txt`);
};
