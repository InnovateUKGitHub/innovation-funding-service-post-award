import { expect, Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";

export
@Fixture("commands")
class Commands {
  private readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  /**
   * Gets an element by following the label attribute.
   *
   * Pass in a string for the label name, and it will return the
   * element linked to the label
   */
  getByLabel(label: string | RegExp, options?: { exact?: boolean }) {
    return this.page.getByLabel(label, options);
  }

  /**
   * Get the text value of the completion status on the PCR details page e.g. 'To do'
   */
  async assertPcrCompletionStatus(pcrType: string, status: string) {
    expect(await this.page.locator("li", { hasText: pcrType }).locator("string").innerText()).toContain(status);
  }

  /**
   * Gets an element based on QA data tag
   */
  getByQA(tag: string | RegExp) {
    return this.page.getByTestId(tag);
  }

  /**
   * Gets the error message attached to an input field using the label as the identifier
   */
  getErrorFromLabel(label: string) {
    const labelElement = this.page.locator("label", { hasText: label });
    const parent = this.page.locator(".govuk-form-group--error").filter({ has: labelElement });
    const error = parent.locator("govuk-error-message");
    return error;
  }

  /**
   * Gets the hint element from a label. If this component
   * does not have an attached label then this method won't work.
   *
   * It works because by convention the id of a hint element should
   * match the id of the input element but with `hint-for-` prefixing it
   */
  getHintFromLabel(label: string) {
    const labelElement = this.page.locator("label", { hasText: label });
    const parent = this.page.locator(".govuk-form-group").filter({ has: labelElement });
    const hint = parent.locator(".govuk-hint");
    return hint;
  }

  /**
   * Gets an element based on the PageQA data tag
   */
  getByPageQA(tag: string) {
    return this.page.locator(`[data-qa="${tag}"]`);
  }

  /**
   * Gets an element based on the aria-label
   */
  getByAriaLabel(label: string) {
    return this.page.locator(`[aria-label="${label}"]`);
  }

  /**
   * Get a list item from its key
   */
  getListItemFromKey(label: string, item: string) {
    const key = this.page.locator("dt", { hasText: label });
    const parent = this.page.locator("div", { has: key });
    return parent.locator("dd", { hasText: item });
  }

  /**
   * Gets an element based on the role and any included label
   */
  getByRole(role: Parameters<typeof this.page.getByRole>[0], label?: string) {
    if (label) {
      return this.page.getByRole(role).filter({ hasText: label });
    }
    return this.page.getByRole(role);
  }

  // /**
  //  * Uses the dev tools to switch to a different named user,
  //  * to enable testing with different access rights.
  //  * It appears to be more stable if done from the home page, before navigating away
  //  */
  // switchUserTo(email: string, options?: { newPath?: string; jsDisabled?: boolean }): void;

  /**
   * Gets the back link element
   */
  backLink(name: string) {
    return this.page.locator("a.govuk-back-link", { hasText: name });
  }

  /**
   * Gets the submit button with the matching name
   */
  submitButton(name: string) {
    return this.page.locator('button[type="submit"').filter({ hasText: name });
  }

  /**
   *
   * Gets the button with the matching name
   */
  button(name: string) {
    return this.page.getByRole("button").filter({ hasText: name });
  }

  /**
   *
   *Gets the button with the matching name
   */
  uploadButton(name: string) {
    return this.page.locator('button[type="submit"').filter({ hasText: name });
  }

  /**
   * Gets a table cell with matching name
   */
  tableCell(name: string) {
    return this.page.locator("td", { hasText: name });
  }

  /**
   * Gets table header with matching name
   */
  tableHeader(name: string) {
    return this.page.locator("th", { hasText: name });
  }

  /**
   * Gets table row with matching row name
   */
  getTableRow(name: string) {
    return this.page.locator("table tr", { hasText: name });
  }

  /**
   * Gets table cell from the header label and the row.
   * @example
   * getCellFromHeaderAndRow("Forecast for period", "Labour");
   */
  async getCellFromHeaderAndRow(header: string, row: string) {
    let index: number = 0;
    await this.page.locator("th").evaluateAll(elements =>
      elements.forEach((element, i) => {
        if (element.textContent === header) {
          index = i;
        }
      }),
    );

    return this.page.locator("table tr", { hasText: row }).locator(`td:nth(${index + 1})`);
  }

  /**
   * Gets table cell from the header label and the row number (1 - indexed).
   * a third argument is a standard selector string to be passed into a find method in case
   * the exact element in the cell needs to be selected
   * @example
   * getCellFromHeaderAndRowNumber("Description", 2, );
   * getCellFromHeaderAndRowNumber("Date secured", 2, '[aria-label="month financing secured"]');
   */
  async getCellFromHeaderAndRowNumber(header: string, row: number, selector?: string) {
    let index: number = 0;
    await this.page.locator("th").evaluateAll(elements =>
      elements.forEach((element, i) => {
        if (element.textContent === header) {
          index = i;
        }
      }),
    );

    const tableRow = this.page.locator(`table tr:nth(${row})`);

    const cell = tableRow.locator(`td:nth(${index})`);
    if (selector) {
      return cell.locator(selector);
    } else {
      return cell;
    }
  }

  /**
   * Clicks checkbox with matching label, scrolls into view and waits before checking
   */
  async clickCheckBox(label: string, uncheck?: boolean) {
    if (uncheck) {
      await this.page.getByLabel(label).uncheck();
    } else {
      await this.page.getByLabel(label).check();
    }
  }

  /**
   *
   * Selects (clicks) the tile with the right title
   */
  async selectTile(label: string) {
    await this.page.locator(".card-link", { hasText: label }).click();
  }

  async validationLink(message: string | RegExp) {
    expect(await this.page.getByTestId("validation-summary").locator("a", { hasText: message }).innerText()).toBe(
      message,
    );
  }

  async validationMessage(message: string) {
    expect(await this.page.getByTestId("validation-summary").filter({ hasText: message }).innerText()).toBe(message);
  }

  async heading(title: string) {
    expect(await this.page.locator("h1", { hasText: title }).innerText()).toBe;
  }

  /**
   *
   * Finds text within a paragraph element
   */
  async paragraph(content: string | RegExp) {
    expect(await this.page.locator("p", { hasText: content }).innerText()).toBe(content);
  }

  /**
   *
   * Finds text within a list element
   */
  list(title: string) {
    return this.page.locator("li", { hasText: title });
  }

  /**
   * Will access the input of type file and pass in file name to files stored in 'cypress-test/cypress/documents/'
   */

  // fileInput(path: string, fileName?: string): Chainable<Element>;

  /**
   * Finds the notification text when uploading or deleting a document
   */
  validationNotification(message: string) {
    return this.page.getByTestId("validation-message-content").filter({ hasText: message });
  }

  // /*
  //  * Download a file
  //  */
  // downloadFile(url: string): Chainable<{
  //   headers: Record<string, string | undefined>;
  //   ok: boolean;
  //   redirected: boolean;
  //   statusText: string;
  //   status: number;
  //   type: globalThis.ResponseType;
  //   url: string;
  //   base64: string;
  // }>;

  /**
   * Creates a PCR from the PCR requests screen by passing in a correct PCR name
   */

  async createPcr(pcr: string, options?: { jsDisabled?: boolean }) {
    this.clickCheckBox(pcr);
    await this.button("Create request").click();
  }

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
  async clickOn(name: string) {
    await this.page.locator("button, a", { hasText: name }).click();
  }

  /**
   * enters the value into the element according to the label
   *
   * the label must be connected to the input via `for` to match the `id`
   */
  async enter(label: string, value: string) {
    await this.getByLabel(label).fill(value);
  }

  /**
   * checks the value in an input element according to the label
   *
   * the label must be connected to the input via `for` to match the `id`
   */
  async checkEntry(label: string, value: string) {
    expect(await this.getByLabel(label).innerText()).toBe(value);
  }

  /**
   * selects the open project matching the label and clicks on it
   */
  async selectProject(label: string) {
    await this.getByQA("pending-and-open-projects").filter({ hasText: label }).click();
  }

  /**
   * checks the total value in a footer row matching a label.
   * Footer element should be bolded (th)
   */
  async checkTotalFor(label: string, total: string | number) {
    expect(await this.page.locator("tr", { hasText: label }).locator("a").innerText()).toBe(String(total));
  }

  /**
   * will find the  link on a table row matching the label and click it.
   * second argument is the link type
   */
  async clickLink(label: string, link: "Edit" | "Review" | "Delete" | "Remove") {
    await this.page.locator("tr", { hasText: label }).locator("a", { hasText: link }).click();
  }

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
  async validateCurrency(label: string, errorLabel: string, validValue: string, submitLabel?: string) {
    const errorToken = errorLabel.toLowerCase();
    const firstPlaceErrorToken = errorToken
      .split("")
      .map((x, i) => (i === 0 ? x.toUpperCase() : x))
      .join("");

    const input = this.getByLabel(label);
    await input.clear();
    if (submitLabel) {
      await this.clickOn(submitLabel);
    }

    await this.validationLink(`Enter ${errorToken}.`);
    await input.fill("banana");
    await this.validationLink(`${firstPlaceErrorToken} must be a number.`);
    await input.clear();
    await input.fill("35.45678");
    await this.validationLink(`${firstPlaceErrorToken} must be 2 decimal places or fewer.`);
    await input.clear();
    await input.fill(validValue);
  }

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
  async validatePositiveWholeNumber(label: string, errorLabel: string, validValue: string, submitLabel?: string) {
    const errorToken = errorLabel.toLowerCase();
    const firstPlaceErrorToken = errorToken
      .split("")
      .map((x, i) => (i === 0 ? x.toUpperCase() : x))
      .join("");
    const input = this.getByLabel(label);
    await input.clear();
    if (submitLabel) await this.clickOn(submitLabel);
    await this.validationLink(`Enter ${errorToken}.`);
    await input.clear();
    await input.fill("banana");
    await this.validationLink(`${firstPlaceErrorToken} must be a number.`);
    await input.clear();
    await input.fill("35.45678");
    await this.validationLink(`${firstPlaceErrorToken} must be a whole number, like 15.`);
    await input.clear();
    await input.fill("-56");
    await this.validationLink(`${firstPlaceErrorToken} must be 0 or more.`);
    await input.clear();
    await input.fill(validValue);
  }

  // /**
  //  * disableJs must be added in the `beforeEach` hook for every test suite in which javascript should be disabled
  //  */
  // disableJs(): void;
  // /**
  //  * Checks for presence and contents of the dropdown 'Learn about files you can upload' section
  //  */
  // learnFiles(): void;
  // /**
  //  * Checks for presence of a user name and deletes all files uploaded by them
  //  */
  // fileTidyUp(name: string): void;
  // /**
  //  * Tests the file component on the page with validation, upload and deletion checks.
  //  * User name, backlink suffix, header, re-navigation, API intercept, cleanup and if PCR must be passed in.
  //  * 'waitIntercepts' is a list of api Intercepts used to pass in different api calls
  //  * @example
  //  * cy.testFileComponent("James Black", "costs to be claimed", "Costs to be claimed", "Continue to documents", Intercepts.claims, true, true, false)
  //  */
  // testFileComponent(
  //   loggedInAs: string,
  //   suffix: string,
  //   headerAssertion: string,
  //   access: string,
  //   intercept: Intercepts,
  //   cleanup: boolean,
  //   pcr: boolean,
  //   loans: boolean,
  //   pcrArea?: string,
  // ): void;

  getLinkInRow(category: string, linkName: string) {
    return this.getTableRow(category).locator("a").filter({ hasText: linkName });
  }
}
