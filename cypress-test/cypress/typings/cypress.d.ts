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
       * Get the text value of the completion status on the PCR details page e.g. 'To do'
       */
      assertPcrCompletionStatus(pcrType: string, status: string): boolean;

      /**
       * Gets an element based on QA data tag
       */
      getByQA(tag: string): Chainable<Element>;

      /**
       * Gets an element based on the aria-label
       */
      getByAriaLabel(label: string): Chainable<Element>;

      /**
       * Uses the dev tools to switch to a different named user,
       * to enable testing with different access rights.
       * It appears to be more stable if done from the home page, before navigating away
       */
      switchUserTo(email: string, goHome?: boolean): void;

      /**
       * Uses dev tools to reset user to system user
       */
      resetUser(goHome?: boolean): void;

      /**
       * Gets the back link element
       */
      backLink(): Chainable<Element>;

      /**
       * Gets the submit button with the matching name
       */
      submitButton(name: string): Chainable<Element>;

      /**
       *
       *Gets the button with the matching name
       */
      uploadButton(name: string): Chainable<Element>;

      /**
       * Gets a table cell with matching name
       */
      tableCell(name: string): Chainable<Element>;

      /**
       * Gets table header with matching name
       */
      tableHeader(name: string): Chainable<Element>;

      /**
       * Clicks checkbox with matching label, scrolls into view and waits before checking
       */
      clickCheckBox(label: string, uncheck?: boolean): void;
    }
  }
}
