import { expect, Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";
import { getLorem } from "../components/lorem";

export
@Fixture("commands")
class Commands {
  private readonly page: Page;
  private readonly checkboxXPath: string;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.checkboxXPath =
      '//label[contains(@class, "govuk-checkboxes__label")]//span[text()="{labelText}"]/ancestor::label/preceding-sibling::input';
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

  async selectPcrType(labelText: string) {
    await this.page.locator(this.checkboxXPath.replace("{labelText}", labelText)).check();
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
  async getListItemFromKey(label: string, item: string) {
    const key = this.page.locator("css=dt").filter({ hasText: label });
    const parent = this.page.locator("css=div").filter({ has: key });
    const grandParent = this.page.locator("css=dl").filter({ has: parent });
    return await grandParent.locator("css=dd", { hasText: item }).isVisible();
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
    await this.page.locator("button, a").filter({ hasText: name }).click();
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
  async validatePositiveWholeNumber(
    label: string,
    errorLabel: string,
    validValue: string,
    valEmpty?: boolean,
    submitLabel?: string,
  ) {
    const errorToken = errorLabel.toLowerCase();
    const firstPlaceErrorToken = errorToken
      .split("")
      .map((x, i) => (i === 0 ? x.toUpperCase() : x))
      .join("");
    const input = this.getByLabel(label);
    const paragraph = this.page.getByRole("paragraph");
    await input.clear();
    if (valEmpty) {
      await this.clickOn(submitLabel);
      await this.validationLink(`Enter valid ${errorToken}.`);
      await paragraph.filter({ hasText: `Enter valid ${errorToken}.` }).isVisible();
    }
    await input.fill("banana");
    await this.clickOn(submitLabel);
    await this.validationLink(`${firstPlaceErrorToken} must be a number.`);
    await paragraph.filter({ hasText: `${firstPlaceErrorToken} must be a number.` }).isVisible();
    await input.fill("35.45678");
    await this.validationLink(`${firstPlaceErrorToken} must be a whole number, like 15.`);
    await paragraph.filter({ hasText: `${firstPlaceErrorToken} must be a whole number, like 3.` }).isVisible();
    await input.fill("-56");
    await this.validationLink(`${firstPlaceErrorToken} must be 1 or more.`);
    await paragraph.filter({ hasText: `${firstPlaceErrorToken} must be 1 or more.` }).isVisible();
    await input.fill(validValue);
  }

  getLinkInRow(category: string, linkName: string) {
    return this.getTableRow(category).locator("a").filter({ hasText: linkName });
  }

  /**
   *
   * Returns a string with full date 00 00 0000
   */
  dateToday() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let fulldate = `${day} ${month} ${year}`;
    return fulldate;
  }

  startDate() {
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    let fulldate = `01 ${month} ${year}`;
    return fulldate;
  }

  endDate() {
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear() + 3;
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 14);
    let fulldate = `${lastDay} ${month} ${year}`;
    return fulldate;
  }

  getLastDayOfMonth(year: number, month: number) {
    let lastDay = new Date(year, month, 0, 14);
    let date = lastDay.toLocaleDateString("en-GB", { day: "2-digit" });
    return date;
  }

  /**
   * Generates a month based on today's date to provide context against a project factory project (also based on today's date).
   * By default it will add an increment to the month. If you pass true for subtract it will subtract.
   * There is also the option to generate the output as a written Month if 'alpha' is passed as true.
   */
  startEndMonth(increment: number, subtract: boolean, alpha?: boolean, numberForOutput?: boolean): string | number {
    const date = new Date();
    if (subtract) {
      date.setMonth(date.getMonth() - increment);
    } else {
      date.setMonth(date.getMonth() + increment);
    }
    if (alpha) {
      return date.toLocaleDateString("en-GB", { month: "short" });
    } else {
      if (numberForOutput) {
        return Number(date.getMonth()) + 1;
      } else {
        return date.getMonth();
      }
    }
  }

  /**
   * Generates an end year based on today. This is the same way automated project factory start dates are created.
   * By default it will add an increment to the year. If you pass true for subtract it will subtract.
   */
  startEndYear(increment: number, subtract: boolean) {
    const currentDate = new Date();
    if (subtract) {
      let year = currentDate.getFullYear() - increment;
      console.log(String(year));
      return year;
    } else {
      let year = currentDate.getFullYear() + increment;
      console.log(String(year));
      return year;
    }
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

  /**
   * Allows input of variable length of characters and checks for validation messages
   */
  async textValidation(
    message: string,
    length: number,
    buttonName: string,
    textarea: boolean,
    mor?: boolean,
    label?: string,
  ) {
    let largeText = getLorem(length);
    if (textarea) {
      await this.page.getByRole("textbox").fill(largeText);
      await this.page.getByRole("textbox").press("End");
      await this.page.getByRole("textbox").press("t");
      await this.page.getByRole("paragraph").filter({ hasText: "You have 1 character too many" }).isVisible();
    } else if (this.page.locator("css=main").filter({ hasText: label })) {
      await this.page.getByLabel(label).fill(largeText);
      await this.page.getByLabel(label).press("End");
      await this.page.getByLabel(label).press("t");
    }
    await this.page.getByRole("button").filter({ hasText: buttonName }).click();
    if (textarea) {
      await this.validationLink(`${message} must be ${length} characters or less.`);
    } else {
      await this.validationLink(`${message} must be ${length} characters or less.`);
      await this.paragraph(`${message} must be ${length} characters or less.`);
    }
    if (textarea) {
      await this.page.getByRole("textbox").press("End");
      await this.page.getByRole("textbox").press("Backspace");
      await this.paragraph("You have 0 characters remaining");
    } else {
      if (this.page.locator("css=main").filter({ hasText: label }))
        await this.page.getByLabel(label).press("Backspace");
    }
    if (mor) {
      await this.page.getByLabel(label).check();
    }
    await this.page.getByRole("button").filter({ hasText: buttonName }).click();
    await expect(this.page.getByTestId("validation-summary")).not.toBeVisible();
  }

  async learnFiles() {
    const guidanceText = [
      "You can upload up to 10 documents at a time. The documents must:",
      "There is no limit to the number of files you can upload in total.",
      "You can upload these file types:",
    ];
    const fileList = [
      "total no more than 32MB in file size",
      "each have a unique file name that describes its contents",
      "PDF",
      "(pdf, xps)",
      "(doc, docx, rtf, txt, odt)",
      "text",
      "presentation",
      "(ppt, pptx, odp)",
      "spreadsheet",
      "(csv, xls, xlsx, ods)",
      "images",
      "(jpg, jpeg, png, odg)",
    ];
    await this.page.locator("css=details").filter({ hasText: "Learn more about files you can upload" }).click();
    await this.page
      .locator("css=details")
      .filter({ hasText: "Learn more about files you can upload" })
      .getAttribute("open");
    for (const txt of guidanceText) {
      await this.page.getByRole("paragraph").filter({ hasText: txt }).isVisible();
    }
    for (const li of fileList) {
      await this.page.getByRole("list").filter({ hasText: li }).isVisible();
    }
  }
}
