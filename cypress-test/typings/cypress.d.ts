export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Gets an element by following the label attribute.
       *
       * Pass in a string for the label name, and it will return the
       * element linked to the label
       */
      getByLabel(label: string): Chainable<Element>;

      /**
       * Gets an element based on QA data tag
       */
      getByQA(tag: string): Chainable<Element>;

      /**
       * Uses the dev tools to switch to a different named user,
       * to enable testing with different access rights. 
       * It appears to be more stable if done from the home page, before navigating away
       */
      switchUserTo(email: string, goHome?: boolean): void;

      /**
       * Uses dev tools to reset user to system user
       */
      resetUser(goHome?: boolean): void
    }
  }
}
