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
      getListItemFromKey(label: string): Chainable<Element>;

      /**
       * Gets an element based on the role
       */
      getByRole(role: string): Chainable<Element>;

      /**
       * Uses the dev tools to switch to a different named user,
       * to enable testing with different access rights.
       * It appears to be more stable if done from the home page, before navigating away
       */
      switchUserTo(email: string, newPath: string): void;

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
    }
  }
}
