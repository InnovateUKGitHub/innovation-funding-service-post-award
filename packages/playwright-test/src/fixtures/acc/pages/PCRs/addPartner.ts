import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../../components/PageHeading";
import { Button } from "../../../../components/Button";
import { getLorem } from "../../../../components/lorem";
import path from "path";
import { DataTable } from "playwright-bdd";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { PutProjectOnHold } from "./putProjectOnHold";

export
@Fixture("addPartner")
class AddPartner {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly pcr: ProjectChangeRequests;
  protected readonly putProjectonHold: PutProjectOnHold;
  private readonly pageTitle: PageHeading;
  private readonly pageHeading: Locator;
  private readonly orgTypeText: Locator;
  private readonly orgContext: Locator;
  private readonly errorMsg: Locator;
  private readonly errorBody: Locator;
  private readonly govInput: Locator;
  private readonly markDown: Locator;
  private readonly search: Locator;
  private readonly govRadioInput: Locator;
  private readonly employees: Locator;
  private readonly endMonth: Locator;
  private readonly spendTable: Locator;
  private readonly links: Locator;
  private readonly costGuidance: Locator;
  private readonly addCost: Locator;
  private readonly overheadRate: Locator;
  private readonly rowLocator: Locator;
  private readonly textarea: Locator;
  private readonly zeroRate: Locator;
  private readonly estimatedCost: Locator;
  private readonly description: Locator;
  private readonly month: Locator;
  private readonly year: Locator;
  private readonly value: Locator;
  private readonly button2: Locator;
  private readonly descrp1: Locator;
  private readonly summarySectionLocator: string;
  private readonly contactsSectionLocator: string;
  private readonly fundingSectionLocator: string;
  private readonly agreementSectionLocator: string;
  private readonly summaryError: Locator;
  private readonly itemError: string;
  private readonly jesSearch: Locator;
  private readonly projectCity: Locator;
  private readonly projectPostcode: Locator;
  private readonly contact1Forename: Locator;
  private readonly contact1Surname: Locator;
  private readonly contact1Phone: Locator;
  private readonly contact1Email: Locator;
  private readonly PageHeading2: Locator;
  private readonly chooseFile: Locator;
  private readonly fileTable: Locator;
  private readonly tsbRef: Locator;
  private readonly fundingTable: string;
  private readonly fundingSource: Locator;
  private readonly fundingDate: Locator;
  private readonly fundingCost: Locator;
  private readonly tablerow1: Locator;
  private readonly tablerow2: Locator;
  private readonly fundingTable1: Locator;

  constructor({
    page,
    commands,
    projectChangeRequests,
    putProjectOnHold,
  }: {
    page: Page;
    commands: Commands;
    projectChangeRequests: ProjectChangeRequests;
    putProjectOnHold: PutProjectOnHold;
  }) {
    this.page = page;
    this.commands = commands;
    this.pcr = projectChangeRequests;
    this.pageTitle = PageHeading.fromTitle(page, "Project change requests");
    this.pageHeading = this.page.locator("//*[@class='govuk-heading-xl clearFix']");
    this.PageHeading2 = this.page.locator("//*[@class='govuk-heading-l']");
    this.orgTypeText = this.page.locator("//span[normalize-space()='What are the different types?']");
    this.orgContext = this.page.locator("//fieldset[@class='govuk-fieldset']//details[@class='govuk-details']");
    this.errorMsg = this.page.locator(".govuk-error-message");
    this.errorBody = this.page.locator(".govuk-error-summary__body");
    this.govInput = this.page.locator("//*[@type='text']");
    this.markDown = this.page.locator("//*[@class='govuk-body markdown']//p");
    this.search = this.page.locator("//input[@id='search']");
    this.govRadioInput = this.page.locator(".govuk-radios");
    this.employees = this.page.locator("//*[@name='numberOfEmployees']");
    this.endMonth = this.page.locator("//input[@id='financialYearEndDate_month']");
    this.spendTable = this.page.locator(".govuk-table");
    this.links = this.page.locator("(//a[@role='link'][normalize-space()='Edit'])");
    this.costGuidance = this.page.locator(
      "div[class='govuk-grid-column-full'] summary[class='govuk-details__summary']",
    );
    this.addCost = this.page.locator("//*[text()='Add a cost']");
    this.overheadRate = this.page.locator("//span[@class='currency']");
    this.rowLocator = this.page.locator(".govuk-table__row");
    this.textarea = this.page.locator("//*[@data-qa='textarea']");
    this.zeroRate = this.page.locator("//input[@id='overheadRate_20']");
    this.estimatedCost = this.page.locator("//input[@id='estimatedCost']");
    this.description = this.page.locator("//input[@id='funds.0.description']");
    this.month = this.page.locator("//input[@id='funds.0.dateSecured_month']");
    this.year = this.page.locator("//input[@id='funds.0.dateSecured_year']");
    this.value = this.page.locator("//input[@id='funds.0.value']");
    this.button2 = this.page.locator("//tbody/tr[2]/td[4]/button[1]");
    this.descrp1 = this.page.locator("//tbody/tr[2]/td[4]/button[1]");
    this.summarySectionLocator = '//dl[@data-qa="add-partner-summary-list-organisation"]';
    this.contactsSectionLocator =
      '//div[@data-qa="add-partner-summary-contacts"]//dl[@data-qa="add-partner-summary-list-contacts-finance-contact"]';
    this.fundingSectionLocator =
      '//div[@data-qa="add-partner-summary-funding"]//dl[@data-qa="add-partner-summary-list-funding"]';
    this.agreementSectionLocator =
      '//div[@data-qa="add-partner-summary-agreement"]//dl[@data-qa="add-partner-summary-list-agreement"]';
    this.itemError = "ul.govuk-error-summary__list > li";
    this.summaryError = this.page.locator(".govuk-error-summary");
    this.jesSearch = this.page.locator("//input[@id='searchJesOrganisations']");
    this.projectCity = this.page.locator("//input[@id='project-city']");
    this.projectPostcode = this.page.locator("//input[@id='project-postcode']");
    this.contact1Forename = this.page.locator("//input[@id='contact1Forename']");
    this.contact1Surname = this.page.locator("//input[@id='contact1Surname']");
    this.contact1Phone = this.page.locator("//input[@id='contact1Phone']");
    this.contact1Email = this.page.locator("//input[@id='contact1Email']");
    this.chooseFile = this.page.locator("//input[@id='files']");
    this.fileTable = this.page.locator(".govuk-table");
    this.tsbRef = this.page.locator("//input[@id='tsb-reference']");
    this.fundingTable = "table tbody tr";
    this.fundingTable1 = this.page.locator(".govuk-table tbody tr tfoot tr");
    this.fundingSource = this.page.locator("td:nth-child(1) input");
    this.fundingDate = this.page.locator("td:nth-child(2) input");
    this.fundingCost = this.page.locator("td:nth-child(3) input");
    this.tablerow1 = this.page.locator("td:nth-child(1)");
    this.tablerow2 = this.page.locator("td:nth-child(2) .currency");
  }

  async editOrReviewBLink(index: number) {
    await this.page.locator("a").nth(index).click();
  }

  async enterTableData(data: Array<{ fund: string; mm: string; yyyy: string; cost: string }>): Promise<void> {
    const rows = this.page.locator(this.fundingTable);

    for (let i = 0; i < data.length; i++) {
      const row = rows.nth(i);

      await row.locator(this.fundingSource).fill(data[i].fund);

      const mmInput = row.locator(this.fundingDate).first();
      const yyyyInput = row.locator(this.fundingDate).last();

      await mmInput.fill(data[i].mm);
      await yyyyInput.fill(data[i].yyyy);

      await row.locator(this.fundingCost).fill(data[i].cost);
    }
  }

  async addAnotherSource(index: number) {
    for (let i = 0; i < index; i++) {
      await this.commands.button("Add another source of funding").click();
      await this.page.waitForTimeout(2000);
    }
  }

  async fillInput(field: string, value: string) {
    const normalizedField = field.replace(/\s+/g, " ").trim().toLowerCase();

    switch (normalizedField) {
      case "directly incurred - staff":
        await this.govInput.nth(1).fill(value);
        break;

      case "directly incurred - travel and subsistence":
        await this.govInput.nth(2).fill(value);
        break;

      case "directly incurred - equipment":
        await this.govInput.nth(3).fill(value);
        break;

      case "directly incurred - other costs":
        await this.govInput.nth(4).fill(value);
        break;

      case "directly allocated - investigations":
        await this.govInput.nth(5).fill(value);
        break;

      case "directly allocated - estates costs":
        await this.govInput.nth(6).fill(value);
        break;

      case "directly allocated - other costs":
        await this.govInput.nth(7).fill(value);
        break;

      case "indirect costs - investigations":
        await this.govInput.nth(8).fill(value);
        break;

      case "exceptions - staff":
        await this.govInput.nth(9).fill(value);
        break;

      case "exceptions - travel and subsistence":
        await this.govInput.nth(10).fill(value);
        break;

      case "exceptions - equipment":
        await this.govInput.nth(11).fill(value);
        break;

      case "exceptions - other costs":
        await this.govInput.nth(12).fill(value);
        break;

      case "tsb reference":
        await this.tsbRef.fill(value);
        break;

      default:
        throw new Error(`Field "${field}" not found`);
    }
  }

  async fileUpload() {
    await this.chooseFile.setInputFiles(path.join("src/components/testFiles/add.png"));
    await this.commands.button("Upload documents").click();
    await this.page.waitForTimeout(2000);
  }

  async enterFinanceDetails(field: string, value: string) {
    switch (field.toLowerCase()) {
      case "fname":
        await this.contact1Forename.fill(value);
        break;

      case "lname":
        await this.contact1Surname.fill(value);
        break;

      case "phone":
        await this.contact1Phone.fill(value);
        break;

      case "email":
        await this.contact1Email.fill(value);
        break;
    }
  }

  async clearFinanceDetails(field: string) {
    switch (field.toLowerCase()) {
      case "fname":
        await this.contact1Forename.clear();
        break;

      case "lname":
        await this.contact1Surname.clear();
        break;

      case "phone":
        await this.contact1Phone.clear();
        break;

      case "email":
        await this.contact1Email.clear();
        break;
    }
  }

  async enterFieldData(field: string, value: string) {
    switch (field.toLowerCase()) {
      case "city":
        await this.projectCity.fill(value);
        break;
      case "postcode":
        await this.projectPostcode.fill(value);
        break;
    }
  }

  async getErrorMessage() {
    return this.errorMsg.textContent();
  }

  private keyLocator(sectionLocator: string, key: string): string {
    return `${sectionLocator}//dt[normalize-space(text())="${key}"]`;
  }

  private valueLocator(sectionLocator: string, key: string): string {
    return `${this.keyLocator(sectionLocator, key)}/following-sibling::dd[not(@class="govuk-summary-list__actions")]`;
  }

  async validateSectionDetails(sectionLocator: string, dataTable: DataTable) {
    for (const row of dataTable.rows()) {
      const key = row[0];
      const value = row[1];

      const valueLocator = this.page.locator(this.valueLocator(sectionLocator, key));

      await expect(valueLocator).toHaveText(value);
    }
  }

  async partnerAgreement() {
    await this.commands.verifyTextOnPage("Add a partner", this.pageHeading);
    await this.commands.button("Save and continue").click();
    await this.page.waitForTimeout(2000);
  }
  async otherFunding(desc: string, day: string, month: string, cost: string) {
    await this.description.fill(desc);
    await this.month.fill(day);
    await this.year.fill(month);
    await this.value.fill(cost);
    await this.page.waitForTimeout(2000);
  }

  async otherFunding1(desc: string, day: string, month: string, cost: string) {
    await this.descrp1.fill(desc);
    await this.govInput.nth(5).fill(day);
    await this.govInput.nth(6).fill(month);
    await this.govInput.nth(7).fill(month);
    await this.page.waitForTimeout(2000);
  }

  async enterTravelSubsistence(description: string, numberOftimes: string, cost: string) {
    await this.govInput.nth(0).fill(description);
    await this.govInput.nth(1).fill(numberOftimes);
    await this.govInput.nth(2).fill(cost);
    await this.commands.button("Save and return to travel and subsistence").click();
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "Provide full details and the purpose for any subsistence expenditure, including the number of staff involved.",
      this.markDown,
    );
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(5000);
  }

  async enterCapitalUsage(description: string, depreciation: string, netValue: string, residual: string, cost: string) {
    await this.pcr.selectRadioButton("New");
    await this.textarea.fill(description);
    await this.govInput.nth(0).fill(depreciation);
    await this.govInput.nth(1).fill(netValue);
    await this.govInput.nth(2).fill(residual);
    await this.govInput.nth(3).fill(cost);
    await this.commands.button("Save and return to capital usage").click();
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "You can claim the usage costs of capital assets you will buy for, or use on, your project.",
      this.markDown,
    );
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(5000);
  }
  async enterSubcontracting(sucontractName: string, country: string, role: string, cost: string) {
    await this.govInput.nth(0).fill(sucontractName);
    await this.govInput.nth(1).fill(country);
    await this.textarea.fill(role);
    await this.govInput.nth(2).fill(cost);
    await this.commands.button("Save and return to subcontracting").click();
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "Subcontracting associate companies should be charged at cost.",
      this.markDown,
    );
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(2000);
  }

  async removeOtherCost2() {
    await this.clickEditByVisibleText("Other costs 2");
    await this.pcr.clickTaskTodo("Remove");
    await this.commands.button("Delete cost").click();
    const tableData = this.spendTable;
    await expect(tableData.locator("th")).toContainText(["Total other costs 2", "£5,000.00"]);
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(2000);
  }
  async otherCost(description: string, cost: string) {
    await this.textarea.fill(description);
    await this.estimatedCost.fill(cost);
    await this.commands.button("Save and return to other costs 2").click();
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "This category can be used for any direct project costs which are not covered in the other categories. Examples of other costs include:",
      this.markDown,
    );
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(2000);
  }

  async enterMaterialCosts(item: string, quantity: string, cost: string) {
    await this.govInput.nth(0).fill(item);
    await this.govInput.nth(1).fill(quantity);
    await this.govInput.nth(2).fill(cost);
    await this.commands.button("Save and return to materials").click();
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "You can claim the costs of materials used on your project providing:",
      this.markDown,
    );
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(2000);
  }

  async clickEditByVisibleText(rowText: string): Promise<void> {
    await this.page.locator(`.govuk-table__row:has-text("${rowText}") a:has-text("Edit")`).click();
    await this.page.waitForTimeout(3000);
  }
  async editByVisibleText(rowText: string): Promise<void> {
    await this.page.locator(`.govuk-summary-list__row:has-text("${rowText}") a:has-text("Edit")`).click();
    await this.page.waitForTimeout(3000);
  }

  async overheadCostCal() {
    await this.govRadioButtons("Calculated");
    await this.commands.verifyTextOnPage(
      "You will need to submit an overheads calculation spreadsheet, available following the link below, if the new partner feels their overheads are higher than 20%.",
    );
    await this.govRadioButtons("20%");
    await expect(this.overheadRate).toHaveText("£540,304,000.00");
    await this.zeroRate.click();
    await expect(this.overheadRate).toHaveText("£0.00");
    await this.page.waitForTimeout(2000);
  }

  async overheadCost(overhead: string) {
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "You may claim for no overhead costs or 20% of your labour costs without providing any further supporting documentation or calculations. Actual costs can be claimed up to a maximum of the calculated figure.",
      this.markDown,
    );
    await this.govRadioButtons("20%");
    await expect(this.overheadRate).toHaveText(overhead);
    await this.commands.button("Save and return to project costs").click();
    await this.page.waitForTimeout(10000);
  }

  async enterLabourCosts(role: string, employeeCost: string, rate: string, daysSpent: string) {
    await this.govInput.nth(0).fill(role);
    await this.govInput.nth(1).fill(employeeCost);
    await this.govInput.nth(2).fill(rate);
    await this.govInput.nth(3).fill(daysSpent);
    await this.commands.button("Save and return to labour").click();
    await this.page.waitForTimeout(3000);
  }

  async addLabourCost() {
    await this.addCost.click();
    await this.page.waitForTimeout(5000);
  }

  async editLink(index: number) {
    const editCount = await this.links.count();
    if (index < 0 || index >= editCount) {
      throw new Error("index ${index} out of bound");
    }
    await this.links.nth(index).click();
    await this.page.waitForTimeout(5000);
  }

  async addFinanceContact(fname: string, lname: string, phone: string, email: string) {
    await this.govInput.nth(0).fill(fname);
    await this.govInput.nth(1).fill(lname);
    await this.govInput.nth(2).fill(phone);
    await this.govInput.nth(3).fill(email);
    await this.commands.button("Save and continue").click();
    await this.page.waitForTimeout(5000);
  }
  async newPartnerInformation(projectRole: string, projectOutput: string, orgType: string) {
    await this.commands.verifyTextOnPage("Add a partner", this.pageHeading);
    await this.commands.verifyTextOnPage("You cannot change this information after you continue.");
    await this.pcr.selectRadioButton(projectRole);
    await this.pcr.selectRadioButton(projectOutput);
    await this.pcr.selectRadioButton(orgType);
    await this.assertDiffOrg();
    await this.commands.button("Save and continue").click();
    await this.page.waitForTimeout(9000);
  }

  async orgDetails(orgSize: string, numberOfEmployees: string) {
    await this.commands.verifyTextOnPage("Add a partner", this.pageHeading);
    await this.govRadioButtons(orgSize);
    await this.employees.fill(numberOfEmployees);
    await this.page.waitForTimeout(9000);
  }

  async stateAid() {
    await this.commands.verifyTextOnPage("Add a partner", this.pageHeading);
    await this.commands.verifyTextOnPage(
      "If we decide to award this organisation funding they must be eligible to receive State aid at the point of the award. If they are found to be ineligible, we will withdraw our offer.",
      this.markDown,
    );
    await this.commands.button("Save and continue").click();
    await this.page.waitForTimeout(9000);
  }

  async companySearch(name: string) {
    await this.search.fill(name);
  }
  async companiesHouse(name: string) {
    const radioButton = this.govRadioInput.locator("label", { hasText: name });
    await radioButton.click();
    await this.page.waitForTimeout(5000);
  }

  async govRadioButtons(name: string): Promise<void> {
    const radioButton = this.govRadioInput.locator("label", { hasText: new RegExp(`^${name}$`) });
    await radioButton.click();
  }

  async enterTextByIndex(index: number, text: string): Promise<void> {
    const inputCount = await this.govInput.count();
    if (index > 0 && index < inputCount) {
      await this.govInput.nth(index).fill(text);
    }
  }

  async assertDiffOrg() {
    await this.orgTypeText.click();

    const expectedContent = [
      "Business - a business based in the UK or overseas.",
      "Research - higher education and organisations registered with Je-S.",
      "Research and technology organisation (RTO) - organisations which solely promote and conduct collaborative research and innovation.",
      "Public sector, charity or non Je-S registered research organisation - a not-for-profit public sector body or charity working on innovation, not registered with Je-S.",
    ];

    for (const text of expectedContent) {
      await expect(this.orgContext).toContainText(text);
    }
  }
  async todoPartner() {
    await this.pcr.clickCreateRequest();
    await this.commands.selectPcrType("Add a partner");
    await this.pcr.clickCreateReq();
    await this.pcr.validatePcrDetails("1", "Add a partner");
    await this.pcr.validatePcrTaskList("1. Give us information", "Add a partner");
    await this.pcr.validatePcrTaskList("1. Give us information", "To do");
    await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "Provide reasons to Innovate UK");
    await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "To do");
    await this.pcr.clickTaskTodo("Add a partner");
    await this.commands.button("Save and continue").click();
  }

  @When("the user completes the request to add a partner")
  async addPartnerPcr() {
    await this.todoPartner();
    await this.commands.verifyTextOnPage("Select project role.Select partner type.", this.errorMsg && this.errorBody);
    await this.commands.verifyTextOnPage("Select partner type.", this.errorMsg && this.errorBody);
    await this.commands.verifyTextOnPage("Select project role.", this.errorMsg && this.errorBody);
    await this.newPartnerInformation("Collaborator", "Yes", "Business");
    await this.stateAid();
    await this.search.fill(getLorem(160));
    await this.commands.verifyTextOnPage("Search query must be 159 characters or less.");
    await this.companySearch("Man &");
    await this.companiesHouse("MAN & CAVE LTD");
    await this.commands.verifyTextOnPage("13 Dymoke Green, St Albans, Hertfordshire, United Kingdom, AL4 9LX");
    await this.commands.verifyTextOnPage("13598965");
    await this.commands.button("Save and continue").click();
    //org size
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage("Select participant size.", this.errorMsg && this.errorBody);
    await this.orgDetails("Medium", "-1");
    await this.commands.verifyTextOnPage("Number of employees must be 0 or more.", this.errorMsg && this.errorBody);
    await this.orgDetails("Medium", "1000000000000");
    await this.commands.verifyTextOnPage(
      "Number of employees must be less than 100000000.",
      this.errorMsg && this.errorBody,
    );
    await this.orgDetails("Medium", "10000");
    await this.commands.button("Save and continue").click();
    await this.page.waitForTimeout(10000);
    await this.endMonth.fill("AB?/%");
    await this.enterTextByIndex(1, "LOREM");
    await this.enterTextByIndex(2, "£11122222222222");
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage(
      "Financial year end turnover must be £999,999,999,999.00 or less.",
      this.errorMsg && this.errorBody,
    );
    await this.commands.verifyTextOnPage("Enter financial year end.", this.errorMsg && this.errorBody);
    await this.endMonth.fill("12");
    await this.enterTextByIndex(1, "24");
    await this.enterTextByIndex(2, "£1000000");
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage("Enter financial year end.", this.errorMsg && this.errorBody);
    await this.enterTextByIndex(1, "2025");
    await this.commands.button("Save and continue").click();
    //Location
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage("Select project location.", this.errorMsg && this.errorBody);
    await this.govInput.nth(0).fill(getLorem(41));
    await this.enterTextByIndex(1, getLorem(11));
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage(
      "Project postcode must be 10 characters or less.",
      this.errorMsg && this.errorBody,
    );
    await this.commands.verifyTextOnPage(
      "Project city must be 40 characters or less.",
      this.errorMsg && this.errorBody,
    );
    await this.govRadioButtons("Inside the United Kingdom");
    await this.govInput.nth(0 && 1).fill("");
    await this.govInput.nth(0).fill(getLorem(40));
    await this.enterTextByIndex(1, getLorem(10));
    await this.commands.button("Save and continue").click();
    //Add person to organisation
    await this.addFinanceContact("Test", "O'brien", "01618889999", "test'obrien@invalid.iuk.com");
    //Spend profile
    const tableData = this.spendTable;
    await expect(tableData.locator("th")).toContainText(["Category", "Cost (£)"]);
    await expect(tableData.locator("td")).toContainText([
      "Labour",
      "Overheads",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "Other costs 2",
      "Other costs 3",
      "Other costs 4",
      "Other costs 5",
    ]);
    //funding
    await this.clickEditByVisibleText("Labour");
    await this.costGuidance.click();
    await this.commands.verifyTextOnPage(
      "You may include the total number of working days for staff but do not include:",
      this.markDown,
    );
    await this.pcr.clickTaskTodo("Add a cost");
    await this.commands.button("Save and return to labour").click();
    await this.commands.verifyTextOnPage(
      "Enter role within project.Enter gross cost of role.Enter rate per day.Enter days spent on project.",
      this.errorMsg && this.errorBody,
    );
    await this.govInput.nth(0 && 1 && 2 && 3).fill("");
    await this.enterLabourCosts("Lorem/tester", "$120000", "-1", "10000000");
    await this.commands.verifyTextOnPage(
      "Gross cost of role must be in pounds (£).Rate per day must be £0.00 or more.Days spent on project must be 1000000 or less.",
      this.errorMsg && this.errorBody,
    );
    await this.govInput.nth(0 && 1 && 2 && 3).fill("");
    await this.enterLabourCosts("Lorem/tester", "120000.000000", "120000.000000", "100000");
    await this.commands.verifyTextOnPage(
      "Gross cost of role must be 2 decimal places or fewer.Rate per day must be 2 decimal places or fewer.",
      this.errorMsg && this.errorBody,
    );
    await this.govInput.nth(0 && 1 && 2 && 3).fill("");
    await this.enterLabourCosts("Lorem/tester", "120000", "-1", "100000");
    await this.commands.verifyTextOnPage("Rate per day must be £0.00 or more.", this.errorMsg);
    await this.govInput.nth(0 && 1 && 2 && 3).fill("");
    await this.govInput.nth(0).fill(getLorem(1001));
    await this.commands.button("Save and return to labour").click();
    await this.commands.verifyTextOnPage(
      "Role within project must be 1000 characters or less.",
      this.errorMsg && this.errorBody,
    );
    await this.govInput.nth(0 && 1 && 2 && 3).fill("");
    await this.enterLabourCosts("Lorem/tester", "£120000", "£900", "1000000");
    await this.addLabourCost();
    await this.enterLabourCosts("/tester", "1200.99", "900.76", "1000000");
    await this.addLabourCost();
    await this.enterLabourCosts("/tester", "1200.99", "900.76", "1000000");
    await expect(tableData.locator("th")).toContainText(["Total labour", "£2,701,520,000.00"]);
    await this.commands.button("Save and return to project costs").click();
    await expect(tableData.locator("th")).toContainText(["Total labour", "£2,701,520,000.00"]);
    //overhead cost
    await this.clickEditByVisibleText("Overheads");
    await this.commands.button("Save and return to project costs").click();
    await this.commands.verifyTextOnPage("Select an overhead rate.", this.errorMsg && this.errorBody);
    await this.overheadCostCal();
    await this.pcr.selectRadioButton("20%");
    await this.overheadCost("£540,304,000.00");
    //Material
    await this.clickEditByVisibleText("Materials");
    await this.addCost.click();
    await this.commands.button("Save and return to materials").click();
    await this.commands.verifyTextOnPage(
      "Enter item description.Enter cost per item.Enter quantity.",
      this.errorMsg && this.errorBody,
    );
    await this.enterMaterialCosts("Material cost Test ", "567", "900");
    //Capital Usage
    await this.clickEditByVisibleText("Capital usage");
    await this.addCost.click();
    await this.commands.button("Save and return to capital usage").click();
    await this.commands.verifyTextOnPage(
      "Enter item description.Enter depreciation period.Enter net present value.Enter residual value.Enter utilisation.",
      this.errorMsg && this.errorBody,
    );
    await this.enterCapitalUsage("Capital Test ", "10", "700", "67", "50");
    //subcontracting
    await this.clickEditByVisibleText("Subcontracting");
    await this.addCost.click();
    await this.commands.button("Save and return to subcontracting").click();
    await this.commands.verifyTextOnPage(
      "Enter subcontractor name.Enter subcontractor country.Enter role and description.Enter cost of subcontractor.",
      this.errorMsg && this.errorBody,
    );
    await this.enterSubcontracting("Software tester", "United Kingdom", "400000", "400000");
    //Travel and subs
    await this.clickEditByVisibleText("Travel and subsistence");
    await this.addCost.click();
    await this.commands.button("Save and return to travel and subsistence").click();
    await this.commands.verifyTextOnPage(
      "Enter description of cost.Enter number of times.Enter cost of each.",
      this.errorMsg && this.errorBody,
    );
    await this.enterTravelSubsistence("Software tester", "10", "10");
    //Other cost
    await this.clickEditByVisibleText("Other costs 2");
    await this.addCost.click();
    await this.otherCost("My New Test", "5000");
    await this.clickEditByVisibleText("Other costs 2");
    await this.addCost.click();
    await this.otherCost("My New Test", "5000");
    await this.removeOtherCost2();
    await this.commands.button("Save and continue").click();

    //other Funding
    await this.govRadioButtons("Yes");
    await this.commands.button("Save and continue").click();
    await this.commands.button("Add another source of funding").click();
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage(
      "Enter funding amount.Enter source of funding.Enter date secured.",
      this.errorMsg && this.errorBody,
    );
    await this.otherFunding("Funded by IUK", "01111", "ABC", "-£");
    await this.commands.verifyTextOnPage(
      "Funding amount must be a number.Date secured must be a date.",
      this.errorMsg && this.errorBody,
    );
    await this.otherFunding(getLorem(1001), "01111", "ABC", "-£");
    await this.commands.verifyTextOnPage(
      "Funding amount must be a number.Source of funding must be 1000 characters or less.Date secured must be a date.",
      this.errorMsg && this.errorBody,
    );
    await this.otherFunding("Funded by IUK", "01", "2025", "£1000");
    await this.commands.button("Save and continue").click();

    //Funding level
    await this.govInput.nth(0).fill("abx12-");
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage("Funding level must be a number.", this.errorMsg && this.errorBody);
    await this.govInput.nth(0).fill("50");
    await this.commands.button("Save and continue").click();

    //Agreement
    await this.partnerAgreement();
  }

  @When("the user sees the summary table with the following details:")
  async validateSummaryDetails(dataTable: DataTable) {
    await this.validateSectionDetails(this.summarySectionLocator, dataTable);
  }

  @When("the user sees the contacts section with the following details:")
  async validateContactDetails(dataTable: DataTable) {
    await this.validateSectionDetails(this.contactsSectionLocator, dataTable);
  }

  @When("the user sees the funding section with the following details:")
  async validateFundingDetails(dataTable: DataTable) {
    await this.validateSectionDetails(this.fundingSectionLocator, dataTable);
  }

  @When("the user sees the agreement section with the following details:")
  async validateAgreementDetails(dataTable: DataTable) {
    await this.validateSectionDetails(this.agreementSectionLocator, dataTable);
    await this.pcr.markAsCompleteSection(true);
    await this.pcr.validatePcrTaskList("1. Give us information", "Complete");
    await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "To do");
  }

  @Then("the request should be submitted")
  async validateAddPartnerReqDetails() {
    await this.page.waitForTimeout(2000);
    await this.pcr.validateSubmittedPcrDetails("Request number", "1");
    await this.pcr.validateSubmittedPcrDetails("Request type", "Add a partner");
    await this.pcr.validateSubmittedPcrDetails("Request started", /^\d{1,2} \w+ \d{4}$/);
    await this.pcr.validateSubmittedPcrDetails("Request status", "Submitted to Monitoring Officer");
    await this.pcr.validateSubmittedPcrDetails("Request last updated", /^\d{1,2} \w+ \d{4}$/);
    await this.commands.button("Return to project change requests").click();
  }

  //Research partner
  @When("the user selects add a partner")
  async addResearchPartner() {
    await this.pcr.clickCreateRequest();
    await this.commands.selectPcrType("Add a partner");
    await this.pcr.clickCreateReq();
    await this.pcr.validatePcrDetails("2", "Add a partner");
    await this.pcr.clickTaskTodo("Add a partner");
  }

  @When("the user completes the new partner information page")
  async newPartnerInfo() {
    await this.govRadioButtons("Collaborator");
    await this.govRadioButtons("No");
    await this.govRadioButtons("Research");
  }

  @When("the user navagigates to the summary page")
  async navigateToSummary() {
    await this.commands.button("Save and return to summary").click();
    //   await this.page.waitForTimeout(5000);
  }

  @When("the user attempts to mark the request as complete without completing the relevant fields")
  async markComplete() {
    await this.pcr.markAsCompleteSection(true);
    //   await this.page.waitForTimeout(5000);
  }

  @Then("the following validation errors should be displayed:")
  async getError(dataTable: DataTable) {
    // await this.page.waitForTimeout(5000);

    await expect(this.summaryError).toBeVisible();

    const errorItems = this.summaryError.locator(this.itemError);
    const errorCount = await errorItems.count();

    const expectedErrors = dataTable.raw().flat();

    expect(errorCount).toBe(expectedErrors.length);

    for (let i = 0; i < errorCount; i++) {
      const errorText = await errorItems.nth(i).innerText();
      expect(errorText.trim()).toBe(expectedErrors[i]);
    }
  }

  @Then('the total field level error must be {string}')
  async costCategoryTotal(total: string) {
    const fieldError = await this.page.locator("//*[text()='Total cost']//following::p[1]").textContent();
    expect(fieldError.trim()).toContain(total);
  }
  // non state aid
  @Given("the user is on the non aid page")
  async nonAid() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner");
    await this.pcr.markAsCompleteSection(true);
    await this.editByVisibleText("Eligibility of aid declaration");
  }

  @When("the user sees the non aid guidance text and navigates to the next page")
  async nonAidGuidance() {
    await this.commands.verifyTextOnPage(
      "Non-aid is only granted to organisations which declare that they will not use the funding:",
      this.markDown,
    );
    await this.commands.button("Save and continue").click();
  }

  @Then("the Search for organisation should be displayed with an error message")
  async verifySearchOrg() {
    await this.commands.verifyTextOnPage("Enter organisation name.", this.errorBody);
  }

  // search org oage
  @Given("the user searches for an organisation")
  async orgPage() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner");
    await this.pcr.markAsCompleteSection(true);
    await this.editByVisibleText("Organisation name");
    await this.jesSearch.fill("Uni");
    await this.companiesHouse("Swindon University");
  }

  @When("the user navigates to the next page")
  async saveContinue() {
    await this.commands.button("Save and continue").click();
  }

  @Then("the Project location page should be displayed with an error message")
  async locationValidation() {
    await this.page.waitForTimeout(7000);
    await this.commands.verifyTextOnPage(
      "Select project location.Enter project city.",
      this.errorMsg && this.errorBody,
    );
  }
  // research location page
  @Given("the user is on the project location page")
  async projectLocationPage() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.editByVisibleText("Project location");
    await this.govRadioButtons("Inside the United Kingdom");
  }
  @Given("the user enters an invalid {string} data {string}")
  async invalidInput(field: string, value: string) {
    await this.enterFieldData(field, value);
  }

  @Then("the user sees error message {string}")
  async projectlocationValidation(expectedError: string) {
    const actualErrorMsg = await this.getErrorMessage();
    expect(actualErrorMsg).toContain(expectedError);
  }

  @When("the user enters a valid city and postcode")
  async enterprojectlocation() {
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.govRadioButtons("Inside the United Kingdom");
    await this.govInput.nth(0).fill("My name is IFSPA pre award and IFSPA pos");
    await this.enterTextByIndex(1, "SN1 VPN");
  }

  @Then("the Add person to organisation page should be displayed")
  async addPerson() {
    await this.page.waitForTimeout(3000);
    await this.commands.verifyTextOnPage("Add a partner", this.pageHeading);
  }

  @Given("the user is on the add person page")
  async addPersonPage() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.editByVisibleText("Phone number");
  }

  @When("the user attempts to submit invalid data an error should be displayed")
  async addPersonInvalidData(dataTable: { rawTable: string[][] }) {
    const rows = dataTable.rawTable.slice(1);

    for (const [field, value, expectedError] of rows) {
      await this.enterFinanceDetails(field, value);
      await this.commands.button("Save and continue").click();

      const error1 = await this.errorBody.textContent();
      const error2 = await this.errorMsg.textContent();
      expect(error1?.trim()).toContain(expectedError);
      expect(error2?.trim()).toContain(expectedError);

      await this.clearFinanceDetails(field);
    }
  }

  @Then("the user enters a valid data:")
  async addPersonValidData(dataTable: { rawTable: string[][] }) {
    const rows = dataTable.rawTable.slice(1);

    for (const [field, value] of rows) {
      await this.enterFinanceDetails(field, value);
    }
  }
  //Jes
  @Then("the Je-s document page should be displayed")
  async verifyJesDocPage() {
    await this.page.waitForTimeout(9000);
    await this.commands.verifyTextOnPage("Files uploaded", this.PageHeading2);
  }

  @Given("the user is on the Je-s document page")
  async jesFileUpload() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.editByVisibleText("Je-S form");
    await this.commands.verifyTextOnPage("Files uploaded", this.PageHeading2);
    await this.commands.verifyTextOnPage(
      "Your new academic partner must apply for funding through the Je-S system. To find out more about the Je-S requirements and processes please go to:",
    );
    await this.commands.verifyTextOnPage(
      "Upload a pdf copy of the completed Je-S output form, once the new partner has a status of 'With Council'. If there is information outstanding or the partner is not at this status, your request will be rejected.",
    );
    await this.commands.verifyTextOnPage(
      "Guidance from Innovate UK for academics applying via the Je-S system (opens in a new window)The Je-S website (opens in a new window)",
    );
  }

  @When("the user user uploads a valid document")
  async jesFileUploaded() {
    await this.fileUpload();
    await this.page.waitForTimeout(5000);
    await this.commands.validationNotification("Your document has been uploaded.");
  }

  @Then("the user sees the document table")
  async docTable(dataTable: DataTable) {
    const expectedTableData = dataTable.hashes()[0];
    const actualTableData = this.fileTable.first();

    const currentDate = this.commands.dateFormatter();

    await expect(actualTableData.locator("td").nth(0)).toHaveText(expectedTableData.file_name);
    await expect(actualTableData.locator("td").nth(1)).toHaveText(expectedTableData.type);
    await expect(actualTableData.locator("td").nth(2)).toHaveText(currentDate);
    await expect(actualTableData.locator("td").nth(3)).toHaveText(expectedTableData.size);
    await expect(actualTableData.locator("td").nth(4)).toHaveText(expectedTableData.uploaded_by);
    await expect(actualTableData.locator("td").nth(5)).toHaveText(expectedTableData.action);
  }

  @Then("the Je-s cost categories page should be displayed")
  async jesProjectCostPage() {
    await this.page.waitForTimeout(5000);
    await this.commands.verifyTextOnPage("Project costs for new partner", this.PageHeading2);
  }

  @Given("the user is on the Je-s cost categories page")
  async jesCostpage() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.editByVisibleText("Project costs for new partner");
  }
  @When("the user validates each cost {string} with an invalid data {string}")
  async invalidJesCost(field: string, value: string) {
    try {
      await this.page.waitForTimeout(5000);
      await this.fillInput(field, value);
    } catch (error) {
      console.error(`Error filling input for field "${field}": ${error.message}`);
      throw error;
    }
  }

  @Then("the user sees cost message {string}")
  async jesError(expectedError: string) {
    const error1 = await this.errorBody.textContent();
    const error2 = await this.errorMsg.textContent();
    expect(error1?.trim()).toContain(expectedError);
    expect(error2?.trim()).toContain(expectedError);
  }

  @Given("the user enters a valid jes costs")
  async entervalidJesCosts(dataTable: { rawTable: string[][] }) {
    const rows = dataTable.rawTable.slice(1);

    for (const [field, value] of rows) {
      await this.fillInput(field, value);
    }
  }

  @Then("the Other public sector funding page should be displayed")
  async getPublicFundingPage() {
    await this.page.waitForTimeout(7000);
    await this.commands.verifyTextOnPage("Other public sector funding?", this.PageHeading2);
    await this.commands.button("Save and continue").click();
    await this.commands.button("Save and return to summary").click();
  }

  @Given("the user is on the Other public sector funding page")
  async getOtherFundingPage() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.editByVisibleText("Other sources of funding?");
    await this.govRadioButtons("Yes");
    await this.commands.button("Save and continue").click();
    await this.commands.verifyTextOnPage("Other public sector funding?", this.PageHeading2);
  }

  @When("the user enters the following invalid funding data:")
  async invalidFunding(dataTable: DataTable) {
    await this.addAnotherSource(5);

    const tableData = dataTable.hashes().map(row => ({
      fund: row.fund,
      mm: row.mm.toString(),
      yyyy: row.yyyy.toString(),
      cost: row.cost.toString(),
    }));
    await this.enterTableData(tableData);
  }

  @When("the user enters the following table data:")
  async enterFundingData(dataTable: DataTable) {
    await this.page.waitForTimeout(2000);
    await this.page.reload();
    await this.addAnotherSource(20);

    const tableData = dataTable.hashes().map(row => ({
      fund: row.fund,
      mm: row.mm.toString().padStart(2, "0"),
      yyyy: row.yyyy.toString(),
      cost: row.cost.toString(),
    }));
    await this.enterTableData(tableData);
  }

  @Then("the funding level page should be displayed")
  async fundingLevel() {
    await this.page.waitForTimeout(5000);
    await this.commands.verifyTextOnPage("Add a partner", this.pageHeading);
    await this.govInput.nth(0).fill("80");
    await this.commands.button("Save and continue").click();
  }

  @Given("the user is on the agreement page")
  async agreementDocPage() {
    await this.pcr.clickTaskTodo("Edit");
    await this.page.waitForTimeout(5000);
    await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
    await this.editByVisibleText("Partner agreement");
  }

  @When("the user uploads the agreement document")
  async agreementDoc() {
    await this.page.waitForTimeout(5000);
    await this.fileUpload();
    await this.commands.validationNotification("Your document has been uploaded.");
  }

  @Given("And the use verifies the table")
  async getFundingTable() {
    await this.page.waitForTimeout(5000);
    const tableData = this.spendTable;
    await expect(tableData.locator("th")).toContainText(["Total other funding", "£13,049,025.21"]);
    await this.commands.button("Save and return to summary").click();
    await this.pcr.markAsCompleteSection(true);
  }

  @Then("the request should be submitted.")
  async getSubmittedRequest() {
    await this.pcr.validateSubmittedPcrDetails("Request number", "2");
    await this.pcr.validateSubmittedPcrDetails("Request type", "Add a partner");
    await this.pcr.validateSubmittedPcrDetails("Request status", "Submitted to Monitoring Officer");
  }

  @When("the user selects specific PCR")
  async clickPcr() {
    await this.editOrReviewBLink(9);
    await this.page.getByRole("link").filter({ hasText: "Add a partner" }).click();
    await this.page.waitForTimeout(5000);
  }

  @Then("the user sees the agreement section displaying the following details:")
  async getAgreementSec(dataTable: DataTable) {
    await this.validateSectionDetails(this.agreementSectionLocator, dataTable);
  }

  @When("the user clicks view")
  async viewPcrDetails() {
    await this.page.waitForTimeout(5000);
    await this.page.getByRole("link").filter({ hasText: "View" }).click();
  }
  //Todo: Encapsulate the locators
  @Then("the user sees the cost category table below")
  async viewJesTable(dataTable: DataTable) {
    await this.page.waitForTimeout(5000);

    const expectedData = dataTable.hashes();

    const tableRows = await this.page.locator("(//table[@class='govuk-table'])[1]//tbody/tr").all();

    expect(tableRows.length).toBe(expectedData.length);

    for (let i = 0; i < expectedData.length; i++) {
      const categoryText = await tableRows[i].locator("td:nth-child(1)").textContent();
      const costText = await tableRows[i].locator("td:nth-child(2) span.currency").textContent();

      expect(categoryText.trim()).toBe(expectedData[i].Category);
      expect(costText.trim()).toBe(expectedData[i].Cost);
    }
    expect((await this.page.locator("//tfoot//span[@class='currency']").textContent()).trim()).toBe(
      "£3,242,739,716.50",
    );
  }

  @Then("the user views a cost category")
  async viewCost(dataTable: DataTable) {
    await this.page.locator("//*[text()='Labour']//following::a[1]").click();
  }

  @Then("the user sees the cost table")
  async costTable(dataTable: DataTable) {
    await this.page.waitForTimeout(9000);
    const expectedData = dataTable.hashes();

    const tableRows = await this.page.locator("(//table[@class='govuk-table'])[1]//tbody/tr").all();

    expect(tableRows.length).toBe(expectedData.length);

    for (let i = 0; i < expectedData.length; i++) {
      const row = tableRows[i];

      const role = await row.locator("td:nth-child(1)").textContent();
      const grossEmployeeCost = await row.locator("td:nth-child(2) .currency").textContent();
      const rate = await row.locator("td:nth-child(3) .currency").textContent();
      const daysSpent = await row.locator("td:nth-child(4)").textContent();
      const totalCost = await row.locator("td:nth-child(5) .currency").textContent();

      expect(role?.trim()).toBe(expectedData[i]["Role within project"]);
      expect(grossEmployeeCost?.trim()).toBe(expectedData[i]["Gross employee cost"]);
      expect(rate?.trim()).toBe(expectedData[i]["Rate"]);
      expect(daysSpent?.trim()).toBe(expectedData[i]["Days to be spent"]);
      expect(totalCost?.trim()).toBe(expectedData[i]["Total cost"]);
    }
    expect((await this.page.locator("//tfoot//span[@class='currency']").textContent()).trim()).toBe(
      "£2,701,520,000.00",
    );
  }

  @When("the user navigates back followed by submitting the request")
  async backToPreviousPage() {
    await this.page.waitForTimeout(5000);
    await this.page.getByRole("link").filter({ hasText: "Back to project costs" }).click();
    await this.commands.button("Return to summary").click();
    await this.page.getByRole("link").filter({ hasText: "Back to request" }).click();
  }

  @Then("the request should be successfully submitted to Innovate")
  async verifySubmittedRequest() {
    await this.page.waitForTimeout(2000);
    await this.pcr.enterComments("Monitoring Officer");
    await this.pcr.selectSend();
    await this.pcr.clickSubmitButton();
    await this.page.waitForTimeout(5000);
    expect((await this.page.locator("//td[normalize-space()='Submitted to Innovate UK']").textContent()).trim()).toBe(
      "Submitted to Innovate UK",
    );
  }
}
