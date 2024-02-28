import { SirtestalotTaskProps, SirtestalotTasks } from "../tasks";

/**
 * Executes a task as specified in "/cypress/step_definitions/node.ts"
 * Wrapper around "cy.task" for typesafety.
 *
 * @param taskName The name of the task
 * @param args The FIRST argument of the task
 * @param options Cypress Options
 * @returns Yeilds the return value of the Sirtestalot Task
 */
const accTask = <T extends keyof SirtestalotTasks>(
  taskName: T,
  args: Omit<Parameters<SirtestalotTasks[T]>[0], keyof SirtestalotTaskProps>,
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable>,
): Cypress.Chainable<ReturnType<SirtestalotTasks[T]>> => {
  return cy.task(taskName, Object.assign({ cyEnv: Cypress.env() }, args), options);
};

const accCommands = {
  accTask,
} as const;

export { accCommands };
