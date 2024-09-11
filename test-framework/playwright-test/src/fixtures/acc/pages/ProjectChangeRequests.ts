import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { BackButton } from "../../../components/BackButton";
import { PageHeading } from "../../../components/PageHeading";
import { Button } from "../../../components/Button";

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
  private readonly onHoldMonth: Locator;
  private readonly onHoldYear: Locator;









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
    this.clickTask = this.page.locator(".app-task-list__task-name");
    this.createReq = this.page.locator('button:has-text("Create request")');
    this.onHoldMonth = this.page.locator("//*[@class='govuk-input govuk-date-input__input govuk-input--width-2']");
    this.onHoldYear = this.page.locator("//*[@class='govuk-input govuk-date-input__input govuk-input--width-4']");




  }

  

  async enterStartMonth(text: string) {
    await this.onHoldMonth.clear();
    await this.onHoldMonth.fill(text);

  }

  async enterStartYear(text: string) {
    await this.onHoldYear.clear();
    await this.onHoldYear.fill(text);

  }

  async clickCreateReq() {
    await this.createReq.click();
  }

  public async clickPcrTask(text: string): Promise<void> {
    const taskCount = await this.clickTask.count();

    for (let i = 0; i < taskCount; i++) {
      const ele = this.clickTask.nth(i);

      const getText = await ele.textContent();

      if (getText == text) {
        await ele.click();
        await ele.waitFor({ state: 'visible' });
        break;

      }

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
    const checkboxLocator = this.page.locator(
      this.checkboxXPath.replace('{labelText}', labelText)
    );
    await checkboxLocator.check();
  }

  async assertCheckboxUnchecked(labelText: string) {
    const checkboxLocator = this.page.locator(
      this.checkboxXPath.replace('{labelText}', labelText)
    );
    const isChecked = await checkboxLocator.isChecked();
    expect(isChecked).toBe(false);
  }




  /**
   * Verifies that PCR guidance texts are evident on the page.
   * @param message - The text to verify.
   * @param selector - Optional selector to narrow down the search to a specific element.
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

    await this.clickPcrTask('Put project on hold');

    await expect(this.requestTitle).toBeVisible();

    await this.enterStartMonth("04");
    await this.enterStartYear("2024")

    await this.verifyTextOnPage("You will not be able to perform any normal activities while this project is on hold, for example you cannot raise project change requests (PCRs), update forecasts, or create and submit claims.");
    

    


    //await this.verifyTextOnPage("Request number");

    //await this.clickPcrTask("Put project on hold");

    //await this.verifyTextOnPage("You must select at least one of the types.");

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




