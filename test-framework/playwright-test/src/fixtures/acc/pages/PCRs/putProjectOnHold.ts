import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { BackButton } from "../../../../components/BackButton";
import { PageHeading } from "../../../../components/PageHeading";
import { Button } from "../../../../components/Button";
import { getLorem } from "../../../../components/lorem";
import path from "path";
import { DataTable } from "playwright-bdd";

export
@Fixture("putProjectOnHold")
class PutProjectOnHold {
  protected readonly page: Page;
  private readonly pageTitle: PageHeading;
  private readonly saveAndReturnSummary: Locator;
  private readonly createRequest: Locator;
  private readonly dashboardTitle: PageHeading;
  private readonly requestTitle: Locator;
  private readonly noOngoingRequest: Locator;
  private readonly projectTitle: Locator;
  private readonly pastRequest: Locator;
  private readonly noPastRequest: Locator;
  private readonly checkboxItemLocator: Locator;
  private readonly labelSpanLocator: Locator;
  private readonly hintSpanLocator: Locator;
  private readonly checkboxXPath: string;
  private readonly checkboxes: Locator;
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
  private readonly markAsComplete: Locator;
  private readonly saveAndReturnToRequest: Locator;
  private readonly reasonText: Locator;
  private readonly requestNumber: Locator;
  private readonly types: Locator;
  private readonly learnMoreSummary: Locator;
  private readonly learnMoreText: Locator;
  private readonly chooseFile: Locator;
  private readonly uploadDocument: Locator;
  private readonly uploadValidation: Locator;
  private readonly onHoldPcrSummary: Locator;
  private readonly reasonTextValue: Locator;
  private readonly pcrTask: Locator;
  private readonly statusComment: Locator;
  private readonly submitButton: Locator;
  private readonly submittedDetails: string;
  private readonly pcrValidationsError: Locator;
  private readonly pcrTable: string;
  private readonly taskLink: Locator;
  private readonly pcrDashboardTable: Locator;
  private readonly pcrTableCell: Locator;
  private readonly requestDetails: Locator;
  private readonly pcrSummaryList: Locator;
  private readonly nextPreviousPage: Locator;
  private readonly backToRequest: Locator;
  private readonly submitPcrs: Locator;
  private readonly iukRadioButton: string;
  private readonly pcrComment: Locator;
  private readonly pcrCommentValidation: Locator;
  private readonly clickLogs: Locator;
  private readonly pcrAudit: Locator;
  private readonly auditComment: Locator;
  private readonly pcrTask1: Locator;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.dashboardTitle = PageHeading.fromTitle(page, "Project change request");
    this.pageTitle = PageHeading.fromTitle(page, "Project change requests");
    this.requestTitle = this.page.locator("//span[@class='govuk-caption-xl']");
    this.saveAndReturnSummary = Button.fromTitle(page, "Save and return to summary");
    this.createRequest = this.page.getByText("Create request");
    this.noOngoingRequest = this.page.getByText("You have no ongoing requests.");
    this.projectTitle = this.page.locator("//*[@class='govuk-caption-xl']");
    this.pastRequest = this.page.locator("//*[@class='govuk-accordion__section-heading-text-focus']");
    this.noPastRequest = this.page.getByText("You have no past requests.");
    this.checkboxItemLocator = page.locator(".govuk-checkboxes__item");
    this.labelSpanLocator = this.checkboxItemLocator.locator("label > span:first-of-type");
    this.hintSpanLocator = this.checkboxItemLocator.locator("label > span.govuk-hint");
    this.checkboxes = this.page.locator('input[type="checkbox"]');
    this.checkboxXPath = '//label[contains(@class, "govuk-checkboxes__label")]//span[text()="{labelText}"]/ancestor::label/preceding-sibling::input'
    this.createReq = this.page.locator('button:has-text("Create request")');
    this.onHoldStartMonth = this.page.locator("//input[@id='suspensionStartDate_month']");
    this.onHoldEndMonth = this.page.locator("//input[@id='suspensionEndDate_month']");
    this.onHoldStartYear = this.page.locator("//input[@id='suspensionStartDate_year']");
    this.onHoldEndYear = this.page.locator("//input[@id='suspensionEndDate_year']");
    this.putOnHold = this.page.locator("//a[normalize-space()='Put project on hold']");
    this.saveAndReturnProject = Button.fromTitle(page, "Save and return to project");
    this.saveAndReturnToRequest = Button.fromTitle(page, "Save and return to request");
    this.saveAndContinue = Button.fromTitle(page, "Save and continue");
    this.startDateEle = this.page.locator(
      'dl[data-qa="projectSuspension"] div[data-qa="startDate"] dd.govuk-summary-list__value span',
    );
    this.endDateEle = this.page.locator(
      'dl[data-qa="projectSuspension"] div[data-qa="endDate"] dd.govuk-summary-list__value span',
    );
    this.editOnHoldDate = this.page.locator(
      "//div[@id='suspensionStartDate']//a[@role='link'][normalize-space()='Edit']",
    );
    this.markAsComplete = this.page.locator("//*[@class='govuk-checkboxes__input']");
    this.reasonText = this.page.locator("//*[@class='govuk-textarea']");
    this.reasonTextValue = this.page.locator("//div[@id='reasoningComments']//dd[@class='govuk-summary-list__value']");
    this.requestNumber = this.page.locator('dt:has-text("Request number") + dd');
    this.types = this.page.locator('dt:has-text("Types") + dd');
    this.learnMoreSummary = this.page.locator('details summary:has-text("Learn more about files you can upload")');
    this.learnMoreText = this.page.locator("//fieldset[@class='govuk-fieldset']//details[@class='govuk-details']");
    this.chooseFile = this.page.locator("//input[@id='files']");
    this.uploadDocument = this.page.locator("//button[normalize-space()='Upload documents']");
    this.uploadValidation = this.page.locator("//*[@data-qa='validation-message-content']")
    this.onHoldPcrSummary = this.page.locator('.govuk-summary-list__key, .govuk-summary-list__value');
    this.pcrTask = this.page.locator("//*[@data-qa='taskList']");
    this.pcrTask1 = this.page.locator("//*[@data-qa='taskList']//span");
    
    this.statusComment = this.page.locator('#accordion-default-content-status-and-comments-log');
    this.submitButton = this.page.locator("//button[normalize-space()='Submit request']");
    this.submittedDetails = (`//dl[@class='govuk-summary-list']//dt[text()='%s']/following-sibling::dd[@class='govuk-summary-list__value']`);
    this.pcrValidationsError = this.page.locator('.govuk-error-summary__body');
    this.pcrTable = ("//table[@class='govuk-table']//th[text()='%s']/following-sibling::td[@class='govuk-table__cell']");
    this.taskLink = this.page.locator('role=link');
    this.pcrDashboardTable = this.page.locator('.govuk-table__body .govuk-table__row');
    this.pcrTableCell = this.page.locator('.govuk-table__cell');
    this.pcrSummaryList = this.page.locator('.govuk-summary-list');
    this.nextPreviousPage = this.page.locator("//span[@class='govuk-navigation-arrows__button__label__category']");
    this.backToRequest = this.page.locator("//a[normalize-space()='Back to request']");
    this.submitPcrs = this.page.locator("//button[normalize-space()='Submit']");
    this.iukRadioButton = "//label[contains(text(),'{text}')]";
    this.pcrComment = this.page.locator("//textarea[@id='comments']");
    this.pcrCommentValidation = this.page.locator("//a[normalize-space()='Comments must be 1000 characters or less.']");
    this.clickLogs = this.page.locator('.govuk-accordion__section-heading-text-focus');
    this.pcrAudit = this.page.locator("//*[@data-qa='projectChangeRequestStatusChangeTable']//td");
    this.auditComment = this.page.locator("(//div[@class='govuk-inset-text govuk-!-margin-top-0 acc-logs-text'])[1]");

  }
  async getPcrAuditTrail(expectedText: string) {
    await this.clickLogs.click();

    const task = this.pcrAudit.locator('*');
    const listCount = await task.count(); 

    let eleFound = false;
  
    for (let i = 0; i < listCount; i++) {
      const textContent = await task.nth(i).innerText(); 
      if (textContent === expectedText) { 
        eleFound= true;
       expect(textContent.trim()).toBe(expectedText); 
        break; 
      }
    }
  }
  // move to helper class 
  dateFormatter(): string {
    return new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/(\d{1,2})\/(\w+)/, '$1 $2');

  }
  async selectRadioButton(radioItem: string) {
    const radioButton = this.page.locator(this.iukRadioButton.replace('{text}', radioItem));
    await radioButton.click();
  }
  async clickBacktoRequest() {
    await this.backToRequest.click();
  }
  async clickNextOrPrevious() {
    await this.nextPreviousPage.click();
  }

  async validateRequestDetails(expectedText: string) {
    const task = this.pcrTask1.locator('*');

    const listCount = await task.count(); 

    console.log('Total element found ${listCount}')
   
    let eleFound = false;
  
    for (let i = 0; i < listCount; i++) {
      const textContent = await task.nth(i).innerText(); 
      if (textContent === expectedText) { 
        let eleFound = true;
        expect(textContent).toBe(expectedText); 
        break; 
      }
    }
}
  async validatePcrSummaryList(expectedText: string) {
    const pcrSummary = this.pcrSummaryList.locator('*');
    const listCount = pcrSummary.count();

    let eleFound = false;
   
    for (let i = 0; i < await listCount; i++) {
      const textContent = await pcrSummary.nth(i).innerText();
      if (textContent === expectedText) { 
        let eleFound = true;
        expect(textContent).toBe(expectedText); 
        break; 
      }
    }
}
  async validateSubmittedPcrDetails(fieldName: string, expectedValue: string | RegExp) {
    const element = this.submittedDetails.replace("%s", fieldName);

    const actualValue = await this.page.textContent(element);
    if (!actualValue) {
      throw new Error(`Field with name "${fieldName}" was not found.`);
    }

    expect(actualValue.trim()).toMatch(expectedValue);
  }

  async submitPcr() {
    await this.submitButton.click();
  }

  async completedPcrTask() {
    const expectedContent = [
      "Give us information",
      "Put project on hold",
      "Complete",
      "Explain why you want to make the changes",
      "Provide reasons to Innovate UK",
      "Complete",
    ];
    for (const text of expectedContent) {
      await expect(this.pcrTask).toContainText(text);
    }
  }

  async projectOnHoldSummary(): Promise<boolean> {
    const ele = await this.onHoldPcrSummary.count();
    expect(ele).toEqual(16);

    if (ele === 0) {
      console.log("No element found: $(this.onHoldPcrSummary");
      return false;
    }

    for (let i = 0; i < ele; i++) {
      if (!this.onHoldPcrSummary.nth(i).isVisible) {
        console.log("Text at index ${i} is not visible");
        return false;
      }
    }
    return true;
  }

  async assertFileUploaded(expectedMessage: string) {
    await expect(this.uploadValidation).toHaveText(expectedMessage);
  }

  async assertPcrError(expectedMessage: string) {
    await expect(this.pcrValidationsError).toHaveText(expectedMessage);
  }

  async assertLearnMoreContent() {
    await this.learnMoreSummary.click();

    const expectedContent = [
      "You can upload up to 10 documents at a time.",
      "total no more than 32MB in file size",
      "each have a unique file name that describes its contents",
      "There is no limit to the number of files you can upload in total.",
      "You can upload these file types:",
      "PDF (pdf, xps)",
      "text (doc, docx, rtf, txt, odt)",
      "presentation (ppt, pptx, odp)",
      "spreadsheet (csv, xls, xlsx, ods)",
      "images (jpg, jpeg, png, odg)",
    ];

    for (const text of expectedContent) {
      await expect(this.learnMoreText).toContainText(text);
    }
  }

  async clickSaveAndContinue() {
    await this.saveAndContinue.click();
  }

  async reasonsToInnovate() {
    await this.clickTaskTodo("Provide reasons to Innovate UK")
    const txt = getLorem(32_000);
    await this.reasonText.fill(txt);
  }

  async enterPcrComment() {
    const textAreContent = await this.reasonText.evaluate(el => (el as any).value);
    expect(textAreContent).toBe("");
    const txt = getLorem(1_000);
    await this.reasonText.fill(txt);
  }

  async getAuditComment() {
    await expect(this.auditComment).toBeVisible();
    const textAreContent = await this.auditComment.evaluate(el => (el as any).value);
    expect(textAreContent).not.toBe('');
  }

  async textAreaNotEmpty() {
    await expect(this.reasonTextValue).toBeVisible();
    const textAreContent = await this.reasonTextValue.evaluate(el => (el as any).value);
    expect(textAreContent).not.toBe("");
  }

  async clickMarkAsComplete() {
    await this.markAsComplete.click();
    await this.saveAndReturnToRequest.click();
  }

  async validateDates(): Promise<void> {
    const dateRegex = /^\d{1,2} [A-Za-z]{3} \d{4}$/;
    const startDate = await this.startDateEle.textContent();
    expect(startDate).toMatch(dateRegex);

    const endDate = await this.endDateEle.textContent();
    endDate ? expect(endDate).toMatch(dateRegex) : console.log("Suspension end date is unknown");
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

  async clickTaskTodo(taskText: string) {
    const todoLink = this.taskLink.count();
    for (let i = 0; i < await todoLink; i++) {
      const ele = this.taskLink.nth(i);
      const txt = ele.innerText();
      if (await txt === taskText) {
        await ele.click();
        return;
      }
    }
  }
  private getPcr(labelText: string): Locator {
    const resolvedXPath = this.checkboxXPath.replace("{labelText}", labelText);
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
    const accCheckboxLocator = this.page.locator(this.checkboxXPath.replace("{labelText}", labelText));
    await accCheckboxLocator.check();
  }

  async assertCheckboxUnchecked(labelText: string) {
    const accCheckboxLocator = this.page.locator(this.checkboxXPath.replace("{labelText}", labelText));
    const isChecked = await accCheckboxLocator.isChecked();
    expect(isChecked).toBe(false);
  }
  public async verifyTextOnPage(message: string, selector?: string): Promise<void> {
    if (selector) {
      const element = this.page.locator(selector);

      await expect(element).toContainText(message);
    } else {
      const pageContent = await this.page.textContent("body");
      if (!pageContent || !pageContent.includes(message)) {
        throw new Error(`Expected text "${message}" not found on the page.`);
      }
    }
  }

  async moSubmitPcr() {
    await this.submitPcrs.click();
  }

  //Steps 
  @Then('the project change request page is displayed')
  async isPage() {
    await expect(this.dashboardTitle.get()).toBeVisible();
  }
  @Given("the user sees the project request page")
  async verifyProjectChangeRequestPage() {
    await expect(this.noOngoingRequest).toBeVisible();
    await expect(this.projectTitle).toBeVisible();
    await expect(this.pastRequest).toBeVisible();
    await this.pastRequest.click();
    await expect(this.noPastRequest).toBeVisible();
  }

  @Given("the following guidance texts are visible:")
  async getPcrGuidanceText(dataTable: { raw: () => [any, any][] }) {
    const guidanceMap = new Map(dataTable.raw().map(([label, hint]) => [label.trim().toLowerCase(), hint.trim()]));

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
  @When("the user completes the request to put a project on hold")
  async completePutProjectOnHold() {
    await this.createRequest.click();
    //assert checkboxes are not checked by default
    await this.assertAllCheckboxesUnchecked();
    await this.selectPcrType("Put project on hold");
    await this.clickCreateReq();
    //Request details
    await expect(this.requestTitle).toBeVisible();
    //Cannot submit a blank request
    await this.submitPcr();
    await this.assertPcrError("Reasons entry must be complete.Put project on hold must be complete.");
    // await this.clickPutProjectOnHold();
    await this.clickTaskTodo("Put project on hold");
    await expect(this.requestTitle).toBeVisible();
    await this.verifyTextOnPage(
      "You will not be able to perform any normal activities while this project is on hold, for example you cannot raise project change requests (PCRs), update forecasts, or create and submit claims.",
    );
    await this.verifyTextOnPage("First day of pause");
    await this.verifyTextOnPage("Last day of pause (if known)");
    await this.enterSuspensionDetails("01", "11", "2024", "2025");
    await this.validateDates();
    //User can edit..
    await this.editSuspensionDetails("02", "02", "2024", "2026");
    await this.validateDates();
    await this.clickMarkAsComplete();
    //Cannot submit without providing reasons to Innovate
    await this.submitPcr();
    await this.assertPcrError("Reasons entry must be complete.");
    await this.reasonsToInnovate();
    await this.verifyTextOnPage("Provide reasons to Innovate UK");
    await this.verifyTextOnPage("Request number");
    await this.verifyTextOnPage(
      "You must explain each change. Be brief and write clearly. If you are requesting a reallocation of project costs, you must justify each change to your costs.",
    );
    await this.clickSaveAndContinue();
    //Doc page
    await expect(this.requestNumber).toBeVisible();
    //await this.verifyTextOnPage("Upload documents");
    await expect(this.types).toBeVisible();
    await this.assertLearnMoreContent();
    await this.chooseFile.setInputFiles(path.join("src/components/testFiles/add.png"));
    await this.uploadDocument.click();
    await this.assertFileUploaded("Your document has been uploaded.");
    await this.clickSaveAndContinue();
    //Reasons summary
    await this.textAreaNotEmpty();
    await this.projectOnHoldSummary();
    await this.clickMarkAsComplete();
  }

  @When('the user clicks submit')
  async clickSubmitRequest() {
    await this.completedPcrTask();
    await this.verifyTextOnPage("Put project on hold");
    await this.verifyTextOnPage("Request number");
    await this.verifyTextOnPage("1");
    await this.verifyTextOnPage(
      "If you want to explain anything to your monitoring officer or to Innovate UK, add it here.",
    );
    await this.enterPcrComment();
    await this.submitPcr();
  }

  @Then("the request should be submitted successfully")
  async validatePcrSubmission() {
    await this.validateSubmittedPcrDetails('Request number', '1');
    await this.validateSubmittedPcrDetails('Request type', 'Put project on hold');
    await this.validateSubmittedPcrDetails('Request started', /^\d{1,2} \w+ \d{4}$/);
    await this.validateSubmittedPcrDetails('Request status', 'Submitted to Monitoring Officer');
    await this.validateSubmittedPcrDetails('Request last updated', /^\d{1,2} \w+ \d{4}$/);
    await this.verifyTextOnPage("Your project change request has been submitted.Please note there is a 30-day Service Level Target from submission of your request to Innovate UK, through to approval of the change(s).");
    await this.verifyTextOnPage("Project change request submitted");
  }

  //MO query 

  @Then('the user sees the following table')
  async reviewPcrDashboard(data: DataTable) {
    const expectedTableData = data.hashes()[0]
    const actualTableData = this.pcrDashboardTable.first()

    const currentDate = this.dateFormatter();

    await expect(actualTableData.locator(this.pcrTableCell).nth(0)).toHaveText(expectedTableData.request_number);
    await expect(actualTableData.locator(this.pcrTableCell).nth(1)).toHaveText(expectedTableData.types);
    await expect(actualTableData.locator(this.pcrTableCell).nth(2)).toHaveText(currentDate);
    await expect(actualTableData.locator(this.pcrTableCell).nth(3)).toHaveText(expectedTableData.status);
    await expect(actualTableData.locator(this.pcrTableCell).nth(4)).toHaveText(currentDate);
    await expect(actualTableData.locator(this.pcrTableCell).nth(5)).toHaveText(expectedTableData.action);
  };

  @When('the user queries the PCR request')
  async queryPcr() {
    await this.clickTaskTodo("Review")
    await expect(this.requestTitle).toBeVisible();
    await this.validateRequestDetails('Put project on hold');
    await this.validateRequestDetails('Reasoning for Innovate UK');
    await this.validateRequestDetails('Explain why you want to make the changes');
    await this.validateRequestDetails('Give us information');
    await this.validatePcrSummaryList('Put project on hold');
    await this.validatePcrSummaryList('1');
    await this.clickTaskTodo("Put project on hold");
    await this.validateDates();
    await this.verifyTextOnPage("28 Feb 2026");
    await this.clickNextOrPrevious();
    //Reason page 
    await this.textAreaNotEmpty();
    await this.validatePcrSummaryList('Put project on hold');
    await this.validatePcrSummaryList('1');
    await this.validatePcrSummaryList('add.png');
    await this.clickNextOrPrevious();
    await this.clickNextOrPrevious();
    await this.clickBacktoRequest();
    await expect(this.requestTitle).toBeVisible();
  }
  @When('the user submits the project change request')
  async moClicksSubmit() {
    await this.selectRadioButton("Query the request");
    await this.moSubmitPcr();
    await this.verifyTextOnPage("Enter comments.");
    await this.pcrComment.fill(getLorem(1_001));
    await this.moSubmitPcr();
    expect(this.pcrCommentValidation).toBeVisible();
    await this.getPcrAuditTrail("Peter May");
    await this.getPcrAuditTrail("Submitted to Monitoring Officer");
    await this.getPcrAuditTrail("Status update");
    await this.getPcrAuditTrail("Draft with Project Manager");
    await this.pcrComment.fill(getLorem(1_000));
    await this.moSubmitPcr();

  }

  @Then('the user should see the following table')
  async queriedPcrDashboard(data: DataTable) {
    const expectedTableData = data.hashes()[0]
    const actualTableData = this.pcrDashboardTable.first()

    const currentDate = this.dateFormatter();

    await expect(actualTableData.locator(this.pcrTableCell).nth(0)).toHaveText(expectedTableData.request_number);
    await expect(actualTableData.locator(this.pcrTableCell).nth(1)).toHaveText(expectedTableData.types);
    await expect(actualTableData.locator(this.pcrTableCell).nth(2)).toHaveText(currentDate);
    await expect(actualTableData.locator(this.pcrTableCell).nth(3)).toHaveText(expectedTableData.status);
    await expect(actualTableData.locator(this.pcrTableCell).nth(4)).toHaveText(currentDate);
    await expect(actualTableData.locator(this.pcrTableCell).nth(5)).toHaveText(expectedTableData.action);

  }

  // Validate user cannot create a request without selecting atleast one pcr
  @Given('the user clicks create request without selecting a PCR')
  async clickOnCreateRequest() {
    await this.createRequest.click();
  }

  @Then("an error message should be displayed")
  async userMustSelectPcrTypeError() {
    await this.createRequest.click();

    await this.verifyTextOnPage("You must select at least one of the types.");
  }
  // Verify guildance texts 

  @Given("the user clicks create request")
  async clickCreateRequest() {
    await this.page.waitForTimeout(30000);
    await this.createRequest.click();
  }
}
