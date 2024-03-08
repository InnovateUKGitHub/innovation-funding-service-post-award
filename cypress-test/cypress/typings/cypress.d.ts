import { PcrType } from "./pcr";
import { Tile } from "./tiles";

/* eslint-disable no-unused-vars */
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
       * Gets the hint element from a label. If this component
       * does not have an attached label then this method won't work.
       *
       * It works because by convention the id of a hint element should
       * match the id of the input element but with `hint-for-` prefixing it
       */
      getHintFromLabel(label: string): Chainable<Element>;

      /**
       * Gets the error message attached to an input field using the label as the identifier
       */
      getErrorFromLabel(label: string): Chainable<Element>;
      /**
       * Gets an element based on the PageQA data tag
       */
      getByPageQA(tag: string): Chainable<Element>;

      /**
       * Gets an element based on the aria-label
       */
      getByAriaLabel(label: string): Chainable<Element>;

      /**
       * Get a list item from its key
       */
      getListItemFromKey(label: string, item: string): Chainable<Element>;

      /**
       * Gets an element based on the role and any included label
       */
      getByRole(role: string, label?: string): Chainable<Element>;

      /**
       * Uses the dev tools to switch to a different named user,
       * to enable testing with different access rights.
       * It appears to be more stable if done from the home page, before navigating away
       */
      switchUserTo(email: string, newPath?: string): void;

      /**
       * Gets the back link element
       */
      backLink(name: string): Chainable<Element>;

      /**
       * Gets the submit button with the matching name
       */
      submitButton(name: string): Chainable<Element>;
      /**
       *
       * Gets the button with the matching name
       */
      button(name: string): Chainable<Element>;

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
       * Gets table row with matching row name
       */
      getTableRow<T extends string>(name: T): Chainable<Element>;

      /**
       * Gets table cell from the header label and the row.
       * @example
       * getCellFromHeaderAndRow("Forecast for period", "Labour");
       */
      getCellFromHeaderAndRow<T extends string, U extends string>(header: T, row: U): Chainable<Element>;

      /**
       * Gets table cell from the header label and the row number (1 - indexed).
       * a third argument is a standard selector string to be passed into a find method in case
       * the exact element in the cell needs to be selected
       * @example
       * getCellFromHeaderAndRowNumber("Description", 2, );
       * getCellFromHeaderAndRowNumber("Date secured", 2, '[aria-label="month financing secured"]');
       */
      getCellFromHeaderAndRowNumber<T extends string>(header: T, row: number, selector?: string): Chainable<Element>;
      /**
       * Clicks checkbox with matching label, scrolls into view and waits before checking
       */
      clickCheckBox<T extends string = string>(label: T, uncheck?: boolean): void;

      /**
       *
       * Finds the defined project name or number and navigates to it from projects main page
       */
      navigateToProject(projectId: string): Chainable<Element>;
      /**
       *
       * Selects (clicks) the tile with the right title
       */
      selectTile(label: Tile): Chainable<Element>;
      /**
       *
       * Will navigate to the project ID in question and delete any PCRs in draft status
       */
      deletePcr(projectId: string): Chainable<Element>;

      validationLink(message: string): Chainable<Element>;

      validationMessage(message: string): Chainable<Element>;

      heading(title: string): Chainable<Element>;

      /**
       *
       * Finds text within a paragraph element
       */
      paragraph(content: string): Chainable<Element>;

      /**
       *
       * Finds text within a list element
       */
      list(title: string): Chainable<Element>;

      /**
       * Will access the input of type file and pass in file name to files stored in 'cypress-test/cypress/documents/'
       */

      fileInput(path: string, fileName?: string): Chainable<Element>;

      /**
       * Finds the notification text when uploading or deleting a document
       */

      validationNotification(message: string): Chainable<Element>;

      /*
       * Download a file
       */
      downloadFile(url: string): Chainable<{
        headers: Record<string, string | undefined>;
        ok: boolean;
        redirected: boolean;
        statusText: string;
        status: number;
        type: globalThis.ResponseType;
        url: string;
        base64: string;
      }>;

      /**
       * Creates a PCR from the PCR requests screen by passing in a correct PCR name
       */

      createPcr(pcr: PcrType): Chainable<Element>;

      /**
       * Finds an exact match for the inserted text and clicks on it.
       * can accept en element selector string (.css selector) as well as content string
       * for better precision if needed. Options as last argument are for the click
       * options, not the contains options. If Contains options are needed, either use a
       * different approach or extend this method
       *
       * N.B not to be used in any case where e.g. waits or focus, or other operations
       * needed before clicking.
       *
       * Best used with main buttons and links that will not have matching copy elsewhere
       *
       * @example
       * cy.clickOn("Save and continue", { force: true });
       * cy.clickOn("button", "Save and continue", { force: true });
       */
      clickOn(name: string, options?: Partial<Cypress.ClickOptions>): void;
      clickOn(element: string, name: string, options?: Partial<Cypress.ClickOptions>): void;

      /**
       * Gets the hint element from a label. If this component
       * does not have an attached label then this method won't work.
       *
       * It works because by convention the id of a hint element should
       * match the id of the input element but with `hint-for-` prefixing it
       */
      getHintFromLabel(label: string): Chainable<Element>;

      /**
       * enters the value into the element according to the label
       *
       * the label must be connected to the input via `for` to match the `id`
       */
      enter(label: string, value: string): void;

      /**
       * checks the value in an input element according to the label
       *
       * the label must be connected to the input via `for` to match the `id`
       */
      checkEntry(label: string, value: string): void;

      /**
       * selects the open project matching the label and clicks on it
       */
      selectProject(label: string): void;

      /**
       * checks the total value in a footer row matching a label.
       * Footer element should be bolded (th)
       */
      checkTotalFor(label: string, total: string | number): void;

      /**
       * will find the  link on a table row matching the label and click it.
       * second argument is the link type
       */
      clickLink(label: string, link: "Edit" | "Review" | "Delete" | "Remove"): void;

      /**
       * runs validations for regular currency input
       *
       * label is the actual label of the input field.
       * errorLabel is the identifier used for the actual error message
       * validValue is the value that should show no error and allow to pass
       * submitLabel if passed in will cause this button to be pressed after the first validation to
       * trigger validation messages
       *
       * @example
       * cy.validateCurrency("Rate (£/day)", "Rate per day", "50000");
       */
      validateCurrency(label: string, errorLabel: string, validValue: string, submitLabel?: string): void;

      /**
       * runs validations for positive whole number inputs
       *
       * label is the actual label of the input field.
       * errorLabel is the identifier used for the actual error message
       * validValue is the value that should show no error and allow to pass
       * submitLabel if passed in will cause this button to be pressed after the first validation to
       * trigger validation messages
       *
       * @example
       * cy.validatePositiveWholeNumber("Days to be spent by all staff with this role", "Days spent on project", "50");
       */
      validatePositiveWholeNumber(label: string, errorLabel: string, validValue: string, submitLabel?: string): void;
    }
  }
}
