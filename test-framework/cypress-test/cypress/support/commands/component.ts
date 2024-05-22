type NullProps = unknown;
type Gettable = string | number | RegExp;
type GetOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>;

const components = [
  ["MainContent", (_?: NullProps, opt?: GetOptions) => cy.get("#main-content", opt)],
  [
    "ProjectDashboardCard",
    ({ projectNumber }: { projectNumber: string }, opt?: GetOptions) => cy.getByQA(`project-${projectNumber}`, opt),
  ],
  [
    "Tile",
    (x?: Gettable, opt?: GetOptions) => {
      let c = cy.get(".card-link", opt);
      if (x) c = c.contains(x);
      return c;
    },
  ],
  ["Form", (_?: NullProps, opt?: GetOptions) => cy.getMainContent({}, opt).find("form")],
  ["FileInput", (_?: NullProps, opt?: GetOptions) => cy.get("input[type=file]", opt)],
  ["TextInput", (_?: NullProps, opt?: GetOptions) => cy.get("input[type=text]", opt)],
  ["RadioInput", (_?: NullProps, opt?: GetOptions) => cy.get("input[type=radio]", opt)],
  ["ValidationError", (_?: NullProps, opt?: GetOptions) => cy.get(".govuk-error-summary", opt)],
  ["SuccessMessage", (_?: NullProps, opt?: GetOptions) => cy.get(".acc-message.acc-message__success", opt)],
  [
    "GovButton",
    (x?: Gettable, opt?: GetOptions) => {
      let c = cy.get(".govuk-button", opt);
      if (x) c = c.contains(x);
      return c;
    },
  ],
  ["Heading", (x: Gettable, opt?: GetOptions) => cy.get("h2,h3,h4,h5,h6", opt).contains(x, { timeout: opt?.timeout })],
  ["Loading", (_?: NullProps, opt?: GetOptions) => cy.getByQA("loading-message")],
] as const;

const componentCommands = Object.fromEntries(
  components.map(([key, getter]) => [
    `get${key}`,
    (...props) => {
      cy.log(`** get ${key} (props: ${JSON.stringify(props)})**`);
      return getter.apply(null, props);
    },
  ]),
) as Readonly<{
  [T in (typeof components)[number] as `get${T[0]}`]: T[1];
}>;

export { componentCommands, GetOptions };
