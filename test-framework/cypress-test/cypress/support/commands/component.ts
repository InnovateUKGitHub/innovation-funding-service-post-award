const components = [
  ["ProjectDashboardCard", ({ projectNumber }: { projectNumber: string }) => cy.getByQA(`project-${projectNumber}`)],
  [
    "Tile",
    ({ label }: { label?: string } = {}) => (label ? cy.get(".card-link").contains(label) : cy.get(".card-link")),
  ],
  ["Form", () => cy.get("form")],
  ["FileInput", () => cy.get("input[type=file]")],
  ["ValidationError", () => cy.get(".govuk-error-summary")],
  ["SuccessMessage", () => cy.get(".acc-message.acc-message__success")],
] as const;

const componentCommands = Object.fromEntries(components.map(([key, getter]) => [`get${key}`, getter])) as Readonly<{
  [T in (typeof components)[number] as `get${T[0]}`]: T[1];
}>;

export { componentCommands };
