import { SirtestalotCommands } from "../commands";
import { SirtestalotTasks } from "../tasks";

declare global {
  namespace Cypress {
    interface Chainable extends SirtestalotCommands {}
    interface Tasks extends SirtestalotTasks {}
  }
}
