import { projectCardCommands } from "./components/projectCard";
import { tileCommands } from "./components/tile";
import { formCommands } from "./components/form";
import { getCommands } from "./get";
import { goToCommands } from "./state/navigate";
import { messageCommands } from "./components/messaging";
import { documentCommands } from "./state/document";
import { accCommands } from "./accTask";
import { cacheCommands } from "./state/cache";

const commands = {
  ...getCommands,
  ...formCommands,
  ...goToCommands,
  ...projectCardCommands,
  ...tileCommands,
  ...messageCommands,
  ...documentCommands,
  ...accCommands,
  ...cacheCommands,

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
