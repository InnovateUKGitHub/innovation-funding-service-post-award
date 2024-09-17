import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { BackButton } from "../../../components/BackButton";
import { PageHeading } from "../../../components/PageHeading";
import { Button } from "../../../components/Button";
import { getLorem } from "../../../components/lorem";
import path from "path";




export
@Fixture("projectChangeRequests")
class ProjectChangeRequests {
  protected readonly page: Page;
  private readonly pageTitle: PageHeading;
  private readonly saveAndReturnSummary: Locator;
  private readonly editPcrLink: Locator;
  private readonly createRequest: Locator;
  private readonly dashboardTitle: PageHeading;
  private readonly requestTitle: Locator;
  private readonly noOngoingRequest: Locator;
  private readonly projectTitle: Locator;
  private readonly alert: Locator;
  private readonly selectPcr: Locator;
  private readonly pastRequest: Locator;
  private readonly noPastRequest: Locator;
  private readonly selectPcrErr: Locator;
  private readonly pcrGuidanceText: Locator;
  private readonly pcrCheckbox: Locator;
  private readonly checkboxItemLocator: Locator;
  private readonly labelSpanLocator: Locator;
  private readonly hintSpanLocator: Locator;
  private readonly checkboxXPath: string
  private readonly checkboxes: Locator;
  private readonly clickTask: Locator;
  private readonly createReq: Locator;
  private readonly onHoldStartMonth: Locator;
  private readonly onHoldEndMonth: Locator;
  private readonly onHoldStartYear: Locator;
  private readonly onHoldEndYear: Locator;
  private readonly putOnHold: Locator;
  private readonly saveAndReturnProject: Locator;
  private readonly saveAndContinue: Locator;
  private readonly startDateEle: Locator;
  private readonly endDateEle: Locator;
  private readonly editOnHoldDate: Locator;
  private readonly markAsComplete: Locator
  private readonly saveAndReturnToRequest: Locator;
  private readonly reasonText: Locator;
  private readonly reasonsLink: Locator;
  private readonly requestNumber: Locator;
  private readonly types: Locator;
  private readonly uploadForm: Locator;
  private readonly filesUploadedText: Locator;
  private readonly learnMoreSummary: Locator;
  private readonly learnMoreText: Locator;
  private readonly chooseFile: Locator;
  private readonly uploadDocument: Locator;
  private readonly uploadValidation: Locator;
  private readonly onHoldPcrSummary: Locator;












  constructor({ page }: { page: Page }) {
    this.page = page;
    this.dashboardTitle = PageHeading.fromTitle(page, "Project change request");
    this.pageTitle = PageHeading.fromTitle(page, "Project change requests");
    this.requestTitle = this.page.locator("//span[@class='govuk-caption-xl']");
    this.saveAndReturnSummary = Button.fromTitle(page, "Save and return to summary");
    this.editPcrLink = this.page.locator("");
    this.createRequest = this.page.getByText("Create request");
    this.noOngoingRequest = this.page.getByText("You have no ongoing requests.");
    this.projectTitle = this.page.locator("//*[@class='govuk-caption-xl']");
    this.pastRequest = this.page.locator("//*[@class='govuk-accordion__section-heading-text-focus']");
    this.noPastRequest = this.page.getByText("You have no past requests.");
    this.selectPcrErr = this.page.locator("//*[@class='govuk-list govuk-error-summary__list']");
    this.pcrGuidanceText = this.page.locator("//*[@class='govuk-checkboxes__item' or @class='govuk-hint']//span");
    this.pcrCheckbox = this.page.locator("//*[@class='govuk-checkboxes__input']");
    this.checkboxItemLocator = page.locator('.govuk-checkboxes__item');
    this.labelSpanLocator = this.checkboxItemLocator.locator('label > span:first-of-type');
    this.hintSpanLocator = this.checkboxItemLocator.locator('label > span.govuk-hint');
    this.checkboxes = this.page.locator('input[type="checkbox"]');
    this.checkboxXPath = '//label[contains(@class, "govuk-checkboxes__label")]//span[text()="{labelText}"]/ancestor::label/preceding-sibling::input'
    this.clickTask = this.page.locator('//ul[@data-qa="taskList"]//a');
    this.createReq = this.page.locator('button:has-text("Create request")');
    this.onHoldStartMonth = this.page.locator("//input[@id='suspensionStartDate_month']");
    this.onHoldEndMonth = this.page.locator("//input[@id='suspensionEndDate_month']");
    this.onHoldStartYear = this.page.locator("//input[@id='suspensionStartDate_year']");
    this.onHoldEndYear = this.page.locator("//input[@id='suspensionEndDate_year']");
    this.putOnHold = this.page.locator("//a[normalize-space()='Put project on hold']");
    this.saveAndReturnProject = Button.fromTitle(page, "Save and return to project");
    this.saveAndReturnToRequest = Button.fromTitle(page, "Save and return to request");
    this.saveAndContinue = Button.fromTitle(page, "Save and continue");
    this.startDateEle = this.page.locator('dl[data-qa="projectSuspension"] div[data-qa="startDate"] dd.govuk-summary-list__value span');
    this.endDateEle = this.page.locator('dl[data-qa="projectSuspension"] div[data-qa="endDate"] dd.govuk-summary-list__value span');
    this.editOnHoldDate = this.page.locator("//div[@id='suspensionStartDate']//a[@role='link'][normalize-space()='Edit']");
    this.markAsComplete = this.page.locator("//*[@class='govuk-checkboxes__input']");
    this.reasonText = this.page.locator("//*[@class='govuk-textarea']");
    this.reasonsLink = this.page.locator("//a[normalize-space()='Provide reasons to Innovate UK']");
    this.requestNumber = this.page.locator('dt:has-text("Request number") + dd');
    this.types = this.page.locator('dt:has-text("Types") + dd');
    this.uploadForm = this.page.locator('fieldset.govuk-fieldset legend.govuk-fieldset__legend--m');
    this.filesUploadedText = this.page.locator('h2.govuk-heading-l + p.govuk-body');
    this.learnMoreSummary = this.page.locator('details summary:has-text("Learn more about files you can upload")');
    this.learnMoreText = this.page.locator("//fieldset[@class='govuk-fieldset']//details[@class='govuk-details']");
    this.chooseFile = this.page.locator("//input[@id='files']");
    this.uploadDocument = this.page.locator("//button[normalize-space()='Upload documents']");
    this.uploadValidation = this.page.locator("//*[@data-qa='validation-message-content']")
    this.onHoldPcrSummary = this.page.locator("//*[@class='govuk-summary-list__key' or @class='govuk-summary-list__value']");
  }

  async projectOnHoldSummary() {
    const dataCount = this.onHoldPcrSummary.count();
    expect(dataCount).toBe('16');
    for (let i = 0; i < await dataCount; i++) {
      await expect(this.onHoldPcrSummary.nth(i)).toBeVisible();
    }

  }

  async assertFileUploaded(expectedMessage: string) {
    await expect(this.uploadValidation).toHaveText(expectedMessage);
  }

  async assertLearnMoreContent() {
    await this.learnMoreSummary.click();

    const expectedContent = [
      'You can upload up to 10 documents at a time.',
      'total no more than 32MB in file size',
      'each have a unique file name that describes its contents',
      'There is no limit to the number of files you can upload in total.',
      'You can upload these file types:',
      'PDF (pdf, xps)',
      'text (doc, docx, rtf, txt, odt)',
      'presentation (ppt, pptx, odp)',
      'spreadsheet (csv, xls, xlsx, ods)',
      'images (jpg, jpeg, png, odg)'
    ];

    for (const text of expectedContent) {
      await expect(this.learnMoreText).toContainText(text);
    }
  }

  async clickSaveAndContinue() {
    await this.saveAndContinue.click();
  }

  async reasonsToInnovate() {
    await this.reasonsLink.click();
    const txt = getLorem(32_000);
    await this.reasonText.fill(txt);
  }

  async textAreaNotEmpty() {
    const textAreContent = await this.reasonText.inputValue();
    expect(textAreContent).not.toBe('');
  }
  async clickMarkAsComplete() {
    await this.markAsComplete.click();
    await this.saveAndReturnToRequest.click()

  }

  async validateDates(): Promise<void> {
    const dateRegex = /^\d{1,2} [A-Za-z]{3} \d{4}$/;
    const startDate = await this.startDateEle.textContent();
    expect(startDate).toMatch(dateRegex);

    const endDate = await this.endDateEle.textContent();
    endDate ? expect(endDate).toMatch(dateRegex) : console.log('Suspension end date is unknown');
  }

  async enterSuspensionDetails(startMonth: string, endMonth: string, startYear: string, endYear: string) {
    await this.onHoldStartMonth.fill(startMonth);
    await this.onHoldEndMonth.fill(endMonth);
    await this.onHoldStartYear.fill(startYear);
    await this.onHoldEndYear.fill(endYear);
    await this.saveAndContinue.click();

  }

  async editSuspensionDetails(startMonth: string, endMonth: string, startYear: string, endYear: string) {
    await this.editOnHoldDate.click();
    await this.onHoldStartMonth.fill(startMonth);
    await this.onHoldEndMonth.fill(endMonth);
    await this.onHoldStartYear.fill(startYear);
    await this.onHoldEndYear.fill(endYear);
    await this.saveAndContinue.click();

  }

  async clickCreateReq() {
    await this.createReq.click();
  }

  async clickPutProjectOnHold() {
    await this.putOnHold.click();
  }

  async clickPcrTask(dynamicText: string): Promise<void> {
    try {
      const elements = await this.clickTask.count();

      for (let i = 0; i < elements; i++) {
        const text = this.clickTask.nth(i);
        const ele = await text.innerText();
        if (ele === dynamicText) {
          await text.click();
          console.log(`Clicked on element with text: ${dynamicText}`);
          return;
        }
      }

      console.log(`No element found with text: ${dynamicText}`);

    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  private getPcr(labelText: string): Locator {
    const resolvedXPath = this.checkboxXPath.replace('{labelText}', labelText);
    return this.page.locator(`xpath=${resolvedXPath}`);
  }
  async assertAllCheckboxesUnchecked() {
    const checkboxCount = await this.checkboxes.count();

    for (let i = 0; i < checkboxCount; i++) {
      const isChecked = await this.checkboxes.nth(i).isChecked();
      expect(isChecked).toBe(false);
    }
  }

  async selectPcrType(labelText: string) {
    const accCheckboxLocator = this.page.locator(
      this.checkboxXPath.replace('{labelText}', labelText)
    );
    await accCheckboxLocator.check();
  }

  async assertCheckboxUnchecked(labelText: string) {
    const accCheckboxLocator = this.page.locator(
      this.checkboxXPath.replace('{labelText}', labelText)
    );
    const isChecked = await accCheckboxLocator.isChecked();
    expect(isChecked).toBe(false);
  }

  /**
   * Verifies that PCR guidance texts are evident on the page.
   * @param message - The text to verify.
   * @param selector - Optional selector to narrow down the search to a specific web element.
   */
  public async verifyTextOnPage(message: string, selector?: string): Promise<void> {
    if (selector) {
      const element = this.page.locator(selector);

      await expect(element).toContainText(message);
    } else {

      const pageContent = await this.page.textContent('body');
      if (!pageContent || !pageContent.includes(message)) {
        throw new Error(`Expected text "${message}" not found on the page.`);
      }
    }

  }

  //Steps 
  @Then('the project change request page is displayed')
  async isPage() {
    await expect(this.dashboardTitle.get()).toBeVisible();

  }
  @Given('the user sees the project request page')
  async verifyProjectChangeRequestPage() {
    await expect(this.noOngoingRequest).toBeVisible();
    await expect(this.projectTitle).toBeVisible();
    await expect(this.pastRequest).toBeVisible();
    await this.pastRequest.click();
    await expect(this.noPastRequest).toBeVisible();
  }

  @Given('the following guidance texts are visible:')
  async getPcrGuidanceText(dataTable: { raw: () => [any, any][]; }) {

    const guidanceMap = new Map(
      dataTable.raw().map(([label, hint]) => [label.trim().toLowerCase(), hint.trim()])
    );

    const checkboxCount = await this.checkboxItemLocator.count();
    for (let i = 0; i < checkboxCount; i++) {
      const checkbox = this.checkboxItemLocator.nth(i); // Access pcr checkbox 

      const labelSpan = checkbox.locator(this.labelSpanLocator);
      const hintSpan = checkbox.locator(this.hintSpanLocator);

      const labelText = (await labelSpan.innerText()).trim().toLowerCase();
      const hintText = (await hintSpan.innerText()).trim();

      if (guidanceMap.has(labelText)) {
        expect(guidanceMap.get(labelText)).toBe(hintText);
      } else {
        throw new Error(`Label text "${labelText}" not found in guidance map.`);
      }
    }
  }
  @When('the user completes the request to put a project on hold')
  async completePutProjectOnHold() {
    await this.createRequest.click();
    //assert checkboxes are not checked by default
    await this.assertAllCheckboxesUnchecked()
    await this.selectPcrType("Put project on hold");
    await this.clickCreateReq();

    //Request details

    await expect(this.requestTitle).toBeVisible();
    //await this.clickPcrTask('Put project on hold');
    await this.clickPutProjectOnHold();
    await expect(this.requestTitle).toBeVisible();
    await this.verifyTextOnPage("You will not be able to perform any normal activities while this project is on hold, for example you cannot raise project change requests (PCRs), update forecasts, or create and submit claims.");
    await this.verifyTextOnPage("First day of pause");
    await this.verifyTextOnPage("Last day of pause (if known)");
    await this.enterSuspensionDetails('01', '11', '2024', '2025');
    await this.validateDates();
    //User can edit..
    await this.editSuspensionDetails('02', '02', '2024', '2026');
    await this.validateDates();
    await this.clickMarkAsComplete();
    await this.reasonsToInnovate();
    await this.verifyTextOnPage('Provide reasons to Innovate UK');
    await this.verifyTextOnPage("Request number");
    await this.verifyTextOnPage("You must explain each change. Be brief and write clearly. If you are requesting a reallocation of project costs, you must justify each change to your costs.");
    await this.clickSaveAndContinue()
    //Doc page
    await expect(this.requestNumber).toBeVisible();
    //await this.verifyTextOnPage("Upload documents");
    await expect(this.types).toBeVisible();
    await this.assertLearnMoreContent();
    await this.chooseFile.setInputFiles(path.join("src/components/testFiles/add.png"));
    await this.uploadDocument.click();
    await this.assertFileUploaded('Your document has been uploaded.');
    await this.clickSaveAndContinue();
    //Reasons summary 
    await this.textAreaNotEmpty();
    await this.projectOnHoldSummary();
    await this.clickMarkAsComplete();

  }
  @When('the user clicks submit')
  async clickSubmitRequest() {



  }

  @Then('the request should be submitted successfully')
  async validatePcrSubmission() {


  }

  // Validate user cannot create a request without selecting atleast one pcr

  @Given('the user clicks create request without selecting a PCR')
  async clickOnCreateRequest() {
    await this.createRequest.click();
  }

  @Then('an error message should be displayed')
  async userMustSelectPcrTypeError() {
    await this.createRequest.click();

    await this.verifyTextOnPage("You must select at least one of the types.");
  }

  // Verify guildance texts 

  @Given('the user clicks create request')
  async clickCreateRequest() {
    await this.page.waitForTimeout(30000);
    await this.createRequest.click();

  }

}




