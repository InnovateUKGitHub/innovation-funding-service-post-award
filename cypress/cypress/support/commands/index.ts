import { fileCommands } from "./file";
import { getCommands } from "./get";

const commands = {
  ...getCommands,
  ...fileCommands,

  clickOnTile(label: string) {
    cy.get(".card-link").contains(label).click();
  },
} as const;

type SirtestalotCommands = typeof commands;
Cypress.Commands.addAll(commands);
export { SirtestalotCommands };
