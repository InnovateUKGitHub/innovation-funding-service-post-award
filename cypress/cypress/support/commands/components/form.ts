const getFileInput = () => cy.get('input[type="file"]');

const setFileFromDisk = (path: string, fileName?: string) => {
  cy.log("**setFileFromDisk**");
  cy.readFile(`cypress/documents/${path}`, null).then((contents: BufferType) => {
    getFileInput().selectFile({
      fileName,
      contents: contents,
    });
  });
};

const setFile = (contents: string, fileName: string) => {
  cy.log("**setFileFromString**");

  getFileInput().selectFile({
    fileName,
    contents: Cypress.Buffer.from(contents),
  });
};

const getForm = () => {
  return cy.get("form").first();
};

const formCommands = { getFileInput, getForm, setFileFromDisk, setFile } as const;

export { formCommands };
