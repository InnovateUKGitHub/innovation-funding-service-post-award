/**
 * seconds
 * -------
 *
 * converts number value to represent seconds into milliseconds.
 * @example
 * cy.wait(seconds(100)) // 100000 milliseconds
 */
export const seconds = (seconds: number) => seconds * 1000;
