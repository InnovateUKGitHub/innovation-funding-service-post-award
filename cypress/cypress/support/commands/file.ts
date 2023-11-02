const getFileInput = () => cy.get('input[type="file"]');

const setFileFromDisk = (path: string, fileName?: string) => {
  cy.log("**setFileFromDisk**");
  cy.readFile(`cypress/documents/${path}`, null).then((contents: typeof Cypress.Buffer) => {
    cy.getFileInput().setFile(contents, fileName);
  });
};

const setFile = (contents: string | BufferType, fileName: string) => {
  cy.log("**setFileFromString**");
  getFileInput().selectFile({
    fileName,
    contents,
  });
};

const fileCommands = { getFileInput, setFileFromDisk, setFile } as const;

export { fileCommands };
