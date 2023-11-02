import { SirtestalotCommands } from "../commands";

declare global {
  namespace Cypress {
    interface Chainable extends SirtestalotCommands {}
  }
}
