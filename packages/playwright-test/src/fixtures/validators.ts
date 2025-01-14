import { expect, Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";
import { Commands } from "./Commands";
import { getLorem } from "../components/lorem";
import {
  comFile,
  conName,
  emptyFileName,
  intlFileName1,
  intlFileName2,
  intlFileName3,
  keyFile,
  longFile,
  lpt1,
  specialCharFile,
  testFile,
  upperCaseExtensionDoc,
  upperCaseExtensionPdf,
  upperCaseExtensionXls,
} from "../components/testFileNames";

export
@Fixture("validators")
class Validators {
  protected readonly page: Page;
  protected readonly commands: Commands;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
  }

  async uploadTriggerValidation(fileName: string, valMsg: string, realFile: boolean) {
    if (realFile) {
      await this.commands.fileInput([fileName]);
      await this.commands.validationLink(valMsg);
      await this.commands.paragraph(valMsg);
    } else {
      await this.commands.uploadAnyFile(fileName);
      await this.commands.validationLink(valMsg);
      await this.commands.paragraph(valMsg);
    }
  }

  async docTypeDropdown(docType: string) {
    await this.page.locator("css=#description").selectOption(docType);
  }

  /**
   * Tests the file component on the page with validation, upload and deletion checks.
   * User name, backlink suffix, header, re-navigation, cleanup and if PCR must be passed in.
   *
   * @example
   * this.commands.testFileComponent("request", "Costs to be claimed", "Labour", "Labour documents", false, false)
   */
  async testFileComponent(
    backLinkSuffix: string,
    headerAssertion: string,
    access: string,
    pcr: boolean,
    loans: boolean,
    pcrArea?: string,
    docType?: string,
  ) {
    const main = this.page.locator("css=main");
    const validation = this.page.getByTestId("validation-message-content");
    await expect(this.page.getByRole("heading").filter({ hasText: "Files uploaded" })).toBeVisible();
    if (pcr) {
      await expect(this.page.getByRole("heading").filter({ hasText: access })).toBeVisible();
    } else if (loans) {
      this.page.locator("css=h1");
    } else {
      await this.commands.paragraph("All documents uploaded will be shown here. All documents open in a new window.");
    }
    await this.commands.learnFiles();
    await this.commands.paragraph("No documents uploaded.");
    console.log("Validating upload button without document selected and then uploading a document");
    await this.commands.button("Upload documents").click();
    await this.commands.validationLink("Choose a file to upload.");
    await this.commands.uploadAnyFile(testFile);
    await this.commands.validationNotification("has been uploaded.").isVisible();
    console.log(
      "Checking that the validation message does not persist when navigating back using 'suffix' and 'headerAssertion",
    );
    if (pcr) {
      await this.commands.backLink(`Back to ${backLinkSuffix}`).click();
      await expect(this.page.getByRole("heading").filter({ hasText: headerAssertion })).toBeVisible();
      const validation = this.page.getByTestId("validation-message-content");
      if (main.filter({ has: validation }).isVisible()) {
        await expect(this.page.getByText("has been uploaded")).not.toBeVisible();
      }
      console.log("Moving forward to the document area again");
      await this.page.getByRole("link").filter({ hasText: access }).click();
      console.log(pcrArea);
      await this.commands.getListItemFromKey(pcrArea, "Edit", true, true, "supportingDocuments");
    } else if (loans) {
      await this.commands.backLink(`Back to ${backLinkSuffix}`).click();
      await expect(this.page.getByRole("heading").filter({ hasText: headerAssertion })).toBeVisible();
      if (main.filter({ has: validation }).isVisible()) {
        await expect(this.page.getByText("has been uploaded")).not.toBeVisible();
      }
      console.log("Moving forward to the document area again");
      await this.commands.clickOn(access);
    } else {
      await this.commands.backLink(`Back to ${backLinkSuffix}`).click();
      await this.commands.heading(headerAssertion);
      if (main.filter({ has: validation }).isVisible()) {
        await expect(this.page.getByText("has been uploaded")).not.toBeVisible();
      }
      console.log("Moving forward to the document area again");
      await this.commands.clickOn(access);
    }
    await expect(this.page.getByRole("heading").filter({ hasText: "Files uploaded" })).toBeVisible();
    console.log("Checking for the presence of a document upload table");
    const subheadings = ["File name", "Type", "Date uploaded", "Uploaded by"];
    for (const heading of subheadings) {
      await expect(this.commands.tableHeader(heading)).toBeVisible();
    }
    await expect(this.page.getByRole("link").filter({ hasText: testFile })).toBeVisible();
    console.log("Deleting document");
    await this.commands.deleteFileFromRow(testFile);
    await this.commands.createTestFile("Biggun", 33);
    await this.page.waitForTimeout(5000);
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    console.log("Attempting to upload a file that is larger than 32MB");
    await this.uploadTriggerValidation("Biggun.txt", "The selected file must be no larger than 32MB.", true);
    console.log("Creating 3 separate larger files");
    for (const doc of this.commands.largerDocs) {
      await this.commands.createTestFile(`${doc}`, 11);
    }
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    console.log("Attempting to upload a batch of docs cumulatively larger than 32MB");
    await this.commands.fileInput(["11MB_1.txt", "11MB_2.txt", "11MB_3.txt"]);
    await this.commands.validationLink("You can only upload up to 32MB at the same time.");
    console.log("Triple batch of 11MB successfully validated.");
    const internationalFiles = [intlFileName1, intlFileName2, intlFileName3];
    for (const file of internationalFiles) {
      if (docType) {
        await this.docTypeDropdown(docType);
      }
      await this.commands.uploadAnyFile(file);
      await expect(this.commands.validationNotification(`Your document has been uploaded.`)).toBeVisible();
      console.log("Deleting allowed special character file");
      await this.commands.deleteFileFromRow(file);
      await expect(this.commands.validationNotification(`'${file}' has been removed.`)).toBeVisible();
      //This timeout is regrettable but required. Otherwise it fails to actually select a file for upload.
      await this.page.waitForTimeout(4000);
    }
    console.log("Checking uppercase file extensions are allowed");
    const upperCaseFiles = [upperCaseExtensionPdf, upperCaseExtensionDoc, upperCaseExtensionXls];
    for (const file of upperCaseFiles) {
      if (docType) {
        await this.docTypeDropdown(docType);
      }
      await this.commands.uploadAnyFile(file);
      await expect(this.commands.validationNotification("has been uploaded.")).toBeVisible();
      console.log("Deleting allowed special character file");
      await this.commands.deleteFileFromRow(file);
      await expect(this.commands.validationNotification(`has been removed.`)).toBeVisible();
      await this.page.waitForTimeout(4000);
    }
    console.log("Validating incorrect file type");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(keyFile, "You cannot upload 'key' because it is the wrong file type.", false);
    console.log("Validating 'Con' as an invalid name");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(conName, "The selected file must not be named CON.", false);
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(lpt1, "The selected file must not be named LPT1.", false);
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(comFile, `The selected file must not be named COM1.`, false);
    console.log("Validating a file with too long a name (over 80 characters)");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(longFile, `The selected file name must be 80 characters or less.`, false);
    console.log("Validating a file with special characters");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(
      specialCharFile,
      "The selected file name cannot use *, <, >, :, / and ? characters.",
      false,
    );
    console.log("Validating a file with an empty name");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.uploadTriggerValidation(emptyFileName, `The selected file name must not begin with a space.`, false);
    console.log("Validating that maximum batch of documents is 10");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.commands.fileInput(this.commands.tooManyDocuments());
    await expect(
      this.page.getByRole("alert").filter({ hasText: "You can only select up to 10 files at the same time." }),
    ).toBeVisible();
    console.log("Uploading a batch of 10 docs of different types");
    if (docType) {
      await this.docTypeDropdown(docType);
    }
    await this.commands.uploadBatchOfDocs(this.commands.allFileTypes);
    console.log("Deleting documents");
    for (const file of this.commands.allFileTypes) {
      await this.commands.deleteFileFromRow(file);
    }
    const testFilesUsed = ["11MB_1.txt", "11MB_2.txt", "11MB_3.txt", "Biggun.txt"];
    for (const file of testFilesUsed) {
      this.commands.deleteTestFile(file);
    }
  }

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
    this.page.getByRole("button").filter({ hasText: buttonName }).click();
    if (textarea) {
      await this.commands.validationLink(`${message} must be ${length} characters or less.`);
    } else {
      await this.commands.validationLink(`${message} must be ${length} characters or less.`);
      await this.commands.paragraph(`${message} must be ${length} characters or less.`);
    }
    if (textarea) {
      await this.page.getByRole("textbox").press("End");
      await this.page.getByRole("textbox").press("Backspace");
      await this.commands.paragraph("You have 0 characters remaining");
    } else {
      if (this.page.locator("css=main").filter({ hasText: label })) this.page.getByLabel(label).press("Backspace");
    }
    if (mor) {
      await this.page.getByLabel(label).check();
    }
    await this.page.getByRole("button").filter({ hasText: buttonName }).click();
    await expect(this.page.getByTestId("validation-summary")).not.toBeVisible();
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
    valEmpty: boolean,
    submitLabel: "Save and continue",
  ) {
    const errorToken = errorLabel.toLowerCase();
    const firstPlaceErrorToken = errorToken
      .split("")
      .map((x, i) => (i === 0 ? x.toUpperCase() : x))
      .join("");
    const input = this.commands.getByLabel(label);
    const paragraph = this.page.getByRole("paragraph");
    await input.clear();
    if (valEmpty) {
      await this.commands.clickOn(submitLabel);
      await this.commands.validationLink(`Enter valid ${errorToken}.`);
      await paragraph.filter({ hasText: `Enter valid ${errorToken}.` }).isVisible();
    }
    await input.fill("banana");
    await this.commands.button(submitLabel).click();
    await this.commands.validationLink(`${firstPlaceErrorToken} must be a number.`);
    await paragraph.filter({ hasText: `${firstPlaceErrorToken} must be a number.` }).isVisible();
    await input.fill("35.45678");
    await this.commands.validationLink(`${firstPlaceErrorToken} must be a whole number, like 15.`);
    await paragraph.filter({ hasText: `${firstPlaceErrorToken} must be a whole number, like 15.` }).isVisible();
    await input.fill("-56");
    await this.commands.validationLink(`${firstPlaceErrorToken} must be 1 or more.`);
    await paragraph.filter({ hasText: `${firstPlaceErrorToken} must be 1 or more.` }).isVisible();
    await input.fill(validValue);
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

    const input = this.commands.getByLabel(label);
    await input.clear();
    if (submitLabel) {
      await this.commands.clickOn(submitLabel);
    }
    await this.commands.validationLink(`Enter ${errorToken}.`);
    await input.fill("banana");
    await this.commands.validationLink(`${firstPlaceErrorToken} must be a number.`);
    await input.clear();
    await input.fill("35.45678");
    await this.commands.validationLink(`${firstPlaceErrorToken} must be 2 decimal places or fewer.`);
    await input.clear();
    await input.fill(validValue);
  }
}
