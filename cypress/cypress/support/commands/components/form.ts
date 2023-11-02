const getFileInput = () => cy.get('input[type="file"]');

const getForm = () => {
  return cy.get("form").first();
};

const formCommands = { getFileInput, getForm } as const;

export { formCommands };
