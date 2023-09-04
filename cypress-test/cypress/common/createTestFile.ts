const fs = require("fs");

export const createTestFile = (name: string, size: number) => {
  cy.wait(2000);
  cy.log(`Creating ${size}MB file: '${name}.txt'. This may take some time...`);
  cy.writeFile(`cypress/common/${name}.txt`, Buffer.alloc(size * 1024 * 1024, "0"), { timeout: 480000 });
};

export const deleteTestFile = (name: string) => {
  cy.task("deleteFile", `cypress/common/${name}.txt`);
};
