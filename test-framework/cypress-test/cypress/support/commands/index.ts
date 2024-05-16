import { getCommands } from "./get";
import { goToCommands } from "./state/navigate";
import { documentCommands } from "./state/document";
import { accCommands } from "./accTask";
import { cacheCommands } from "./state/cache";
import { componentCommands } from "./component";
import { projectFactoryCommands } from "./state/projectFactory";

const commands = {
  ...getCommands,
  ...goToCommands,
  ...documentCommands,
  ...accCommands,
  ...cacheCommands,
  ...componentCommands,
  ...projectFactoryCommands,

  clickOnTile(label: string) {
    cy.get(".card-link").contains(label).click();
  },

  clickOnDetails(label: string) {
    cy.get("summary").contains(label).parent().click();
  },
} as const;

type SirtestalotCommands = typeof commands;
Cypress.Commands.addAll(commands);
export { SirtestalotCommands };
