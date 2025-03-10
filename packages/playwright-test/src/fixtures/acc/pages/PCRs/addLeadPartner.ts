import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../../components/PageHeading";
import { Button } from "../../../../components/Button";
import { getLorem } from "../../../../components/lorem";
import path from "path";
import { DataTable } from "playwright-bdd";
import { Commands } from "../../../Commands";
import { ProjectChangeRequests } from "./ProjectChangeRequests";
import { AddPartner } from "./addPartner";

export
@Fixture("addLeadPartner")
class AddLeadPartner {
    protected readonly page: Page;
    protected readonly commands: Commands;
    protected readonly pcr: ProjectChangeRequests;
    protected readonly addPartner: AddPartner;
    private readonly errorMsg: Locator;
    private readonly errorBody: Locator;
    private readonly govInput: Locator;
    private readonly employees: Locator;
    private readonly spendTable: Locator;
    private readonly overheadRate: Locator;
    private readonly textarea: Locator;
    private readonly zeroRate: Locator;
    private readonly estimatedCost: Locator; 
    private readonly summaryError: Locator;
    private readonly PageHeading2: Locator;
    private readonly orgName: Locator;
    private readonly regNum: Locator;
    private readonly regAdress: Locator;
    private readonly contact1: Locator;
    private readonly pmContactSection: string;
    private readonly table1: Locator;
    private readonly costs: Locator;
    private readonly items: Locator;
    private readonly total: Locator;
    private readonly categoryTotal: Locator;
    private readonly errorItems: Locator;
    private readonly getPMContact: Locator;
    private readonly contact2Forename: Locator;
    private readonly costsTotal: Locator;
    private readonly remove_cost: Locator;
    private readonly partnerTotalCosts: Locator;

    constructor({
        page,
        commands,
        projectChangeRequests,
        addPartner,
    }: {
        page: Page;
        commands: Commands;
        projectChangeRequests: ProjectChangeRequests;
        addPartner: AddPartner;
    }) {
        this.page = page;
        this.commands = commands;
        this.pcr = projectChangeRequests;
        this.addPartner = addPartner;
        this.PageHeading2 = this.page.locator("//*[@class='govuk-heading-l']");
        this.errorMsg = this.page.locator(".govuk-error-message");
        this.errorBody = this.page.locator(".govuk-error-summary__body");
        this.govInput = this.page.locator("//*[@type='text']");
        this.employees = this.page.locator("//*[@name='numberOfEmployees']");
        this.spendTable = this.page.locator('.govuk-table')
        this.overheadRate = this.page.locator("//span[@class='currency']");
        this.textarea = this.page.locator("//*[@data-qa='textarea']");
        this.zeroRate = this.page.locator("//input[@id='overheadRate_20']");
        this.estimatedCost = this.page.locator("//input[@id='estimatedCost']");
        this.summaryError = this.page.locator(".govuk-error-summary");
        this.orgName = this.page.locator("//input[@id='organisationName']");
        this.regNum = this.page.locator("//input[@id='registrationNumber']");
        this.regAdress = this.page.locator("//*[@id='registeredAddress']");
        this.contact1 = this.page.locator("div[id='contact1Forename'] a[role='link']");
        this.pmContactSection = '//div[@data-qa="add-partner-summary-contacts"]//dl[@data-qa="add-partner-summary-list-contacts-project-manager"]';
        this.table1 = this.page.locator("(//table[@class='govuk-table'])[1]//tbody/tr");
        this.costs = this.page.locator("td:nth-child(2) .currency");
        this.items = this.page.locator("td:nth-child(1)");
        this.total = this.page.locator("//tfoot//span[@class='currency']");
        this.categoryTotal = this.page.locator("//*[@id='total-cost']");
        this.errorItems = this.summaryError.locator(".govuk-error-summary__list li a");
        this.getPMContact = this.page.locator("//button[normalize-space()='Use the same details as the finance contact']");
        this.contact2Forename = this.page.locator("//input[@id='contact2Forename']");
        this.costsTotal = this.page.locator("th[id='category-total-cost'] span[class='currency']");
        this.remove_cost = this.page.locator("tbody tr:nth-child(22) td:nth-child(3) div:nth-child(2) a:nth-child(1)");
        this.partnerTotalCosts = this.page.locator(" th[id='new-partner-total-costs'] span[class='currency']");

    }

    async otherCosts(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'description':
                await this.textarea.fill(value);
                break;

            case 'estimate':
                await this.estimatedCost.fill(value);
                break;
        }
    }

    async travelSubsistence(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'description':
                await this.page.locator("//input[@id='descriptionOfCost']").fill(value);
                break;

            case 'number_of_times':
                await this.page.locator("//input[@id='numberOfTimes']").fill(value);
                break;

            case 'cost':
                await this.page.locator("//input[@id='costOfEach']").fill(value);
                break;
        }
    }

    async enterSubcontracting(field: string, value: string) {
        switch (field.toLowerCase()) {

            case 'description':
                await this.textarea.fill(value);
                break;

            case 'subcontractor_name':
                await this.page.locator("//input[@id='subcontractorName']").fill(value);
                break;

            case 'subcontractor_country':
                await this.page.locator("//input[@id='subcontractorCountry']").fill(value);

            case 'cost':
                await this.page.locator("//input[@id='value']").fill(value);
                break;
        }
    }

    async enterCapitalUsage(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'description':
                await this.textarea.fill(value);
                break;

            case 'select_type':
                await this.pcr.selectRadioButton(value);
                break;

            case 'depreciation':
                await this.govInput.nth(0).fill(value);
                break;

            case 'net_value':
                await this.govInput.nth(1).fill(value);
                break;

            case 'residual_value':
                await this.govInput.nth(2).fill(value);
                break;

            case 'utilisation':
                await this.govInput.nth(3).fill(value);
                break
        }
    }
    async enterMaterialsCost(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'item':
                await this.page.locator("//input[@id='materialsDescription']").fill(value);
                break;

            case 'quantity':
                await this.page.locator("//input[@id='quantity']").fill(value);
                break;

            case 'cost':
                await this.page.locator("//input[@id='costPerItem']").fill(value);
                break;
        }
    }
    async removeCost() {
        await this.remove_cost.click();
        await this.commands.button("Delete cost").click();
    }

    async validateOverheads() {
        await this.zeroRate.click();
        let zeroRate = await this.overheadRate.textContent();
        if (zeroRate !== "£0.00") throw new Error("0% is incorrect")

        await this.addPartner.govRadioButtons("20%");
        let twentyPercent = await this.overheadRate.textContent();
        if (twentyPercent !== "£92,600.00") throw new Error("20% is incorrect")

        await this.addPartner.govRadioButtons("Calculated");
        await this.commands.verifyTextOnPage("You will need to submit an overheads calculation spreadsheet, available following the link below, if the new partner feels their overheads are higher than 20%.");
    }

    async validateErrorMessages(expectedErrors: string[]) {
        await expect(this.summaryError).toBeVisible();

        const errorCount = await this.errorItems.count();


        expect(errorCount).toBe(expectedErrors.length);


        for (let i = 0; i < errorCount; i++) {
            const errorText = await this.errorItems.nth(i).innerText();

            expect(errorText.trim()).toBe(expectedErrors[i]);
        }
    }

    async getCategoryTotal(amount: string) {
        expect((await this.categoryTotal.textContent()).trim()).toBe(amount);
    }

    async enterLabourCosts(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'role':
                await this.page.locator("//input[@id='descriptionOfRole']").fill(getLorem(1001));

            case 'gross':
                await this.page.locator("//input[@id='grossCostOfRole']").fill(value);
                break;

            case 'rate':
                await this.page.locator("//input[@id='ratePerDay']").fill(value);
                break;

            case 'days':
                await this.page.locator("//input[@id='daysSpentOnProject']").fill(value);
                break;
        }
    }

    async enterLabourCosts1(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'role':
                await this.page.locator("//input[@id='descriptionOfRole']").fill(value);

            case 'gross':
                await this.page.locator("//input[@id='grossCostOfRole']").fill(value);
                break;

            case 'rate':
                await this.page.locator("//input[@id='ratePerDay']").fill(value);
                break;

            case 'days':
                await this.page.locator("//input[@id='daysSpentOnProject']").fill(value);
                break;
        }
    }
    async validFinancialEndYear(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'month':
                await this.govInput.nth(0).fill(value);
                break;

            case 'year':
                await this.govInput.nth(1).fill(value);
                break;

            case 'turnover':
                await this.govInput.nth(2).fill(value);
                break;
        }
    }

    async financialYearDetails(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'month':
                await this.govInput.nth(0).fill(value);
                break;

            case 'year':
                await this.govInput.nth(1).fill(value);
                break;

            case 'turnover':
                await this.govInput.nth(2).fill(value);
                break;

            case 'month':
                await this.govInput.nth(0).fill(value);
                break;

            case 'year':
                await this.govInput.nth(1).fill(value);
                break;

            case 'turnover':
                await this.govInput.nth(2).fill(value);
                break;

            case 'month':
                await this.govInput.nth(0).fill(value);
                break;

            case 'year':
                await this.govInput.nth(1).fill(value);
                break;

            case 'turnover':
                await this.govInput.nth(2).fill(value);
                break;

            case 'turnover':
                await this.govInput.nth(2).fill(value);
                break;

            case 'month':
                await this.govInput.nth(0).fill(value);
                break;

            case 'year':
                await this.govInput.nth(1).fill(value);
                break;
        }
    }

    async employee(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'number_employee':
                await this.employees.fill(value);
                break;

            case 'number_employee':
                await this.employees.fill(value);
                break;

            case 'number_employee':
                await this.employees.fill(value);
                break;

            case 'number_employee':
                await this.employees.fill(value);
                break;

            case 'number_employee':
                await this.employees.fill(value);
                break
        }
    }

    async companyDetails(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'organisation_name':
                await this.orgName.fill(getLorem(101));
                break;

            case 'registration_number':
                await this.regNum.fill(getLorem(101));
                break;

            case 'registration_address':
                await this.regAdress.fill(getLorem(3_001));
                break;
        }
    }
    async clearcompanyDetails(field: string) {
        switch (field.toLowerCase()) {
            case 'organisation_name':
                await this.orgName.clear();
                break;

            case 'registration_number':
                await this.regNum.clear();
                break;

            case 'registration_address ':
                await this.regAdress.clear();
                break;
        }
    }

    async enterPmDetails(field: string, value: string) {
        switch (field.toLowerCase()) {
            case 'fname':
                await this.govInput.nth(0).fill(value);
                break;

            case 'lname':
                await this.govInput.nth(1).fill(value);
                break;

            case 'phone':
                await this.govInput.nth(2).fill(value);
                break;

            case 'email':
                await this.govInput.nth(3).fill(value);
                break;
        }
    }

    @When('the user selects a partner')
    async selectPartner() {
        await this.pcr.clickCreateRequest()
        await this.commands.selectPcrType("Add a partner");
        await this.pcr.clickCreateReq();
        await this.pcr.validatePcrDetails("1", "Add a partner");
        await this.pcr.clickTaskTodo("Add a partner");
    }

    @When('the user completes the lead partner information page')
    async newPartnerInfo() {
        await this.addPartner.govRadioButtons("Project Lead");
        await this.addPartner.govRadioButtons("No");
        await this.addPartner.govRadioButtons("Business");
    }

    @Given('the user is on the company house page')
    async companyLookupPage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner");
        await this.addPartner.editByVisibleText("Organisation name");
    }

    @When('the user attempts to submit an invalid company details an error should be displayed')
    async invalidCompanyDetails(dataTable: { rawTable: string[][] }) {
        const rows = dataTable.rawTable.slice(1);

        for (const [field, value, expectedError] of rows) {

            await this.companyDetails(field, value);

            await this.commands.button("Save and continue").click();

            const error1 = await this.errorBody.textContent()
            const error2 = await this.errorMsg.textContent()
            expect(error1?.trim()).toContain(expectedError);
            expect(error2?.trim()).toContain(expectedError);

            await this.clearcompanyDetails(field);
        }
    }

    @When('the user searches for a company')
    async companyLookup() {
        await this.addPartner.companySearch("#");
        await this.addPartner.companiesHouse("BLUE # STUDIO LTD");
        await this.commands.verifyTextOnPage("17 Howard Close, Daventry, England, NN11 4TD");
        await this.commands.verifyTextOnPage("13190467");
    }

    @Then('the organisation size page should be displayed')
    async orgSize() {
        await this.page.waitForTimeout(7000)
        await this.commands.verifyTextOnPage("Organisation details", this.PageHeading2);
    }

    @Given('the user is on the organisation size page')
    async orgSizePage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.pcr.markAsCompleteSection(true);
        await this.addPartner.editByVisibleText("Size");
        await this.page.waitForTimeout(9000);
        await this.commands.verifyTextOnPage("Select participant size.", this.errorMsg && this.errorBody);
        await this.addPartner.orgDetails("Medium", "1");

    }

    @When('the user attempts to submit an invalid number of employees')
    async invalidEmployeeData(dataTable: { rawTable: string[][] }) {

        const rows = dataTable.rawTable.slice(1);

        for (const [field, value, expectedError] of rows) {

            await this.employee(field, value);

            await this.commands.button("Save and continue").click();

            const error1 = await this.errorBody.textContent()
            const error2 = await this.errorMsg.textContent()
            expect(error1?.trim()).toContain(expectedError);
            expect(error2?.trim()).toContain(expectedError);

            await this.employees.clear();
        }
    }

    @When('the user enters a valid employee details')
    async validEmployeeData() {
        await this.employees.fill("100000")
    }

    @Then('the financial end year page should be displayed')
    async financialDetail() {
        await this.page.waitForTimeout(5000);
        await this.commands.verifyTextOnPage("Financial details", this.PageHeading2);
    }

    @Given('the user is on the financial end year page page')
    async fiancialEndYear() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.addPartner.editByVisibleText("End of financial year");

    }

    @When('the user attempts to submit an invalid financial end year details')
    async invalidFinancial(dataTable: { rawTable: string[][] }) {

        const rows = dataTable.rawTable.slice(1);

        for (const [field, value, expectedError] of rows) {

            await this.financialYearDetails(field, value);

            await this.commands.button("Save and continue").click();

            const error1 = await this.errorBody.textContent()
            const error2 = await this.errorMsg.textContent()
            expect(error1?.trim()).toContain(expectedError);
            expect(error2?.trim()).toContain(expectedError);

            await this.govInput.nth(0).clear();
            await this.govInput.nth(1).clear();
            await this.govInput.nth(2).clear();
        }
    }


    @When('the user enters a valid financial end year details')
    async validFinancial(dataTable: { rawTable: string[][] }) {
        const rows = dataTable.rawTable.slice(1);

        for (const [field, value] of rows) {
            await this.validFinancialEndYear(field, value);
        }
    }
    @Then('the project location page should be displayed')
    async locationPage() {
        await this.page.waitForTimeout(5000);
        await this.commands.verifyTextOnPage("Project location", this.PageHeading2);
    }

    @Given('the user is on the project location web page')
    async enterLocationDetails() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.addPartner.editByVisibleText("Project location")
    }

    @Given('the user is on the add person web page')
    async addContact() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.contact1.click();
    }

    @Given('the user is on the PM contact page')
    async addSecondContact() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.contact1.click();
        await this.commands.button("Save and continue").click();
    }

    @When('the user enters a valid PM data:')
    async validPmData(dataTable: { rawTable: string[][] }) {

        const rows = dataTable.rawTable.slice(1);

        for (const [field, value] of rows) {
            await this.enterPmDetails(field, value);
        }
    }

    @Then('the user sees the PM section with the following details:')
    async pmContactDetails(dataTable: DataTable) {
        await this.page.waitForTimeout(9000);
        await this.addPartner.validateSectionDetails(this.pmContactSection, dataTable);
    }
    @Given('the user is on the spend profile page')
    async spendProfile() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.addPartner.editByVisibleText("Project costs for new partner")

    }

    @When('the user clicks the same details as the finance contact')
    async autoAddPmContact() {
        await this.page.waitForTimeout(5000);
        await this.commands.verifyTextOnPage("Add person to organisation", this.PageHeading2);
        const textAreContent = await this.contact2Forename.evaluate(el => (el as any).value);
        expect(textAreContent).not.toBe("");
        await this.getPMContact.click();
    }

    @Given('the user sees the spend profile table below')
    async costTable(dataTable: DataTable) {
        await this.page.waitForTimeout(9000);
        const expectedData = dataTable.hashes();

        const tableRows = await this.table1.all();

        expect(tableRows.length).toBe(expectedData.length);

        for (let i = 0; i < expectedData.length; i++) {
            const row = tableRows[i];

            const category = await row.locator(this.items).textContent();
            const cost = await row.locator(this.costs).textContent();

            expect(category?.trim()).toBe(expectedData[i]['Category']);
            expect(cost?.trim()).toBe(expectedData[i]['Cost']);

        }
        expect((await this.total.textContent()).trim()).toBe('£0.00');
    }

    @Given('the user is in the spend profile page')
    async labourCostsPage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.addPartner.editByVisibleText("Project costs for new partner");
    }

    @When('the user navigates to the summary page')
    async getSummaryPage() {
        await this.page.waitForTimeout(5000);
        await this.commands.button("Save and return to summary").click();
    }


    @Given('the user navigates to the labour costs page')
    async gotoLabourPage() {
        await this.page.waitForTimeout(5000);
        await this.addPartner.clickEditByVisibleText("Labour");
        await this.pcr.clickTaskTodo("Add a cost");
    }

    @When('the user validates validates labour {string} with an invalid data {string}')
    async invalidLabourCosts(field: string, value: string) {
        await this.page.waitForTimeout(5000);
        await this.enterLabourCosts(field, value);
        await this.commands.button("Save and return to labour").click();
    }

    @Then('the user sees the following cost errors:')
    async getError(dataTable: DataTable) {
        const expectedErrors = dataTable.rows().map(row => row[0].trim());

        await expect(this.summaryError).toBeVisible();
        const errorItems = this.errorItems;
        const errorCount = await errorItems.count();
        const actualErrors: string[] = [];

        for (let i = 0; i < errorCount; i++) {
            actualErrors.push((await errorItems.nth(i).innerText()).trim());
        }

        expect(actualErrors).toEqual(expectedErrors);

    }

    @When('the user enters a valid labour cost below:')
    async validLabourCosts(dataTable: { rawTable: string[][] }) {

        const rows = dataTable.rawTable.slice(1);

        for (const [field, value] of rows) {
            await this.enterLabourCosts1(field, value);
        }
    }

    @Then('the total should be {string}')
    async getTotal(total: string) {
        await this.page.waitForTimeout(5000);
        await this.getCategoryTotal(total);
    }

    @Then('the cost total should be {string}')
    async totalLabour(amount: string) {
        await this.page.waitForTimeout(5000);
        expect((await this.costsTotal.textContent()).trim()).toBe(amount);
    }

    @Then('the user clicks save and return to labour')
    async saveAndReturnToLabour() {
        await this.page.waitForTimeout(5000);
        await this.commands.button("Save and return to labour").click();
    }

    @Then('the user clicks add a cost')
    async clickAddCost() {
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a cost");
    }

    @Then('the user clicks save and return to project')
    async saveAndReturnToProject() {
        await this.commands.button("Save and return to project costs").click();

    }

    @Then('total cost categories should be {string}')
    async totalCosts(amount: string) {
        expect((await (this.partnerTotalCosts.textContent())).trim()).toBe(amount);
    }

    @Given('the user navigate to the Overheads page')
    async overheadsPage() {
        await this.page.waitForTimeout(5000);
        await this.addPartner.clickEditByVisibleText("Overheads");
    }
    @Then('the user completes the Overheads')
    async getOverheads() {
        await this.validateOverheads()
        await this.commands.button("Calculate overheads documents").click();
        await this.page.waitForTimeout(5000);
        await this.addPartner.fileUpload();
        await this.commands.button("Save and return to overheads costs").click();
        await this.commands.button("Save and return to project costs").click();
        await this.commands.verifyTextOnPage("Enter total cost of overheads.", this.errorBody);
        await this.addPartner.govRadioButtons("20%");
        await this.commands.button("Save and return to project costs").click();
        const tableData = this.spendTable;
        await expect(tableData.locator("th")).toContainText(["Total costs (£)", "£555,600.00"]);
    }

    @Given('the user clicks edit')
    async clickEdit() {
        await this.page.waitForTimeout(3000);
        await this.pcr.clickTaskTodo("Back to labour");
        await this.page.waitForSelector("(//a[@role='link'][normalize-space()='Edit'])[2]");
        await this.page.locator("(//a[@role='link'][normalize-space()='Edit'])[2]").click();
    }


    @When('the user enters a valid labour cost below twenty times:')
    async enterAdditionalLabourCosts(dataTable: { rawTable: string[][] }) {
        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 20; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.enterLabourCosts1(field, value);
            }
            await this.commands.button("Save and return to labour").click();
        }
    }

    @When('the user removes a cost')
    async clickRemoveCost() {
        await this.page.waitForTimeout(3000);
        await this.removeCost()
    }

    @Given('the user is on the materials page')
    async materialsPage() {
        await this.page.waitForTimeout(5000);
        await this.addPartner.clickEditByVisibleText("Materials");
        await this.pcr.clickTaskTodo("Add a cost");
    }

    @When('the user enters the following materials costs')
    async invalidMaterialsCost(dataTable: { rawTable: string[][] }) {

        const rows = dataTable.rawTable.slice(1);

        for (const [field, value] of rows) {

            await this.enterMaterialsCost(field, value);
        }
    }


    @Then('the user clicks back to materials')
    async backToMaterials() {
        await this.page.waitForTimeout(3000);
        await this.pcr.clickTaskTodo("Back to materials");
    }

    @When('the user enters the following materials costs twenty times')
    async materialCosts(dataTable: { rawTable: string[][] }) {
        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 20; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.enterMaterialsCost(field, value);
            }
            await this.commands.button("Save and return to materials").click();
        }
    }

    @When('the user clicks save and return to materials')
    async clickReturnToMaterials() {
        await this.commands.button("Save and return to materials").click();
    }

    @Given('the user navigates to the capital usage page')
    async capitalUsagePage() {
        await this.page.waitForTimeout(5000);
        await this.addPartner.clickEditByVisibleText("Capital usage");
        await this.pcr.clickTaskTodo("Add a cost");

    }

    @When('the user validates validates capital usage {string} with an invalid data {string}')
    async invalidCapitalUsage(field: string, value: string) {
        await this.page.waitForTimeout(5000);
        await this.enterCapitalUsage(field, value);
        await this.commands.button("Save and return to capital usage").click();
    }

    @Then('the user sees the following cost error:')
    async additionalError(dataTable: DataTable) {
        const expectedErrors = dataTable.rows().map(row => row[0].trim()).filter(error => error !== '');

        await expect(this.summaryError).toBeVisible();
        const errorItems = this.errorItems;
        const errorCount = await errorItems.count();
        const actualErrors: string[] = [];

        for (let i = 0; i < errorCount; i++) {
            const errorText = ((await errorItems.nth(i).innerText()).trim());
            if (errorText !== '') {
                actualErrors.push(errorText);
            }
        }
        expect(actualErrors.length).toEqual(expectedErrors.length);
        expect(actualErrors).toEqual(expectedErrors);

    }

    @Given('the user is on the capital usage page')
    async capitalUsage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.clickEditByVisibleText("Capital usage");

    }

    @When('the user enters the following Utilisation costs five times')
    async validUtilization(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 5; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.enterCapitalUsage(field, value);
            }
            await this.commands.button("Save and return to capital usage").click();
        }
    }

    @Given('the user is on the subcontracting page')
    async subcontractingPage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.clickEditByVisibleText("Subcontracting");
    }

    @When('the user enters the following subcontracting costs five times')
    async enterSubcontractingCost(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 5; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.enterSubcontracting(field, value);
            }
            await this.commands.button("Save and return to subcontracting").click();
        }
    }

    @Given('the user is on the travel and subsistenc page')
    async travelSusistencePage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.clickEditByVisibleText("Travel and subsistence");

    }

    @When('the user enters the following travel and subsistenc costs five times')
    async traveLSusistenceCost(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 5; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.travelSubsistence(field, value);
            }
            await this.commands.button("Save and return to travel and subsistence").click();
        }
    }

    @Given('the user is on the other cost page')
    async otherCostPage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.editLink(6);
    }

    @When('the user enters the following other costs four times')
    async  enterOtherCosts(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 4; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.otherCosts(field, value);
            }
            await this.commands.button("Save and return to other costs").click();
        }
    }

    @Given('the user is on the other cost2 page')
    async otherCostTwo(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.editLink(7);
    }

    @When('the user enters the following other cost2 three times')
    async  enterOtherCosts2(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 3; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.otherCosts(field, value);
            }
            await this.commands.button("Save and return to other costs 2").click();
        }
    }

    @Given('the user is on the other cost3 page')
    async otherCostThree(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.editLink(8);
    }

    @When('the user enters the following other cost3 four times')
    async  enterOtherCosts3(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 4; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.otherCosts(field, value);
            }
            await this.commands.button("Save and return to other costs 3").click();
        }
    }

    @Given('the user is on the other cost4 page')
    async otherCostFour(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.editLink(9);
    }

    @When('the user enters the following other cost4 four times')
    async  enterOtherCosts4(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 4; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.otherCosts(field, value);
            }
            await this.commands.button("Save and return to other costs 4").click();
        }
    }

    @Given('the user is on the other cost5 page')
    async otherCostFive(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Project costs for new partner");
        await this.addPartner.editLink(10);
    }

    @When('the user enters the following other cost5 four times')
    async  enterOtherCost5(dataTable: { rawTable: string[][] }) {

        await this.page.waitForTimeout(3000);

        for (let i = 0; i < 4; i++) {
            await this.page.locator("//a[normalize-space()='Add a cost']").click();

            const rows = dataTable.rawTable.slice(1);

            for (const [field, value] of rows) {
                await this.otherCosts(field, value);
            }
            await this.commands.button("Save and return to other costs 5").click();
        }
    }

    @Then('the user sees the spend profile below')
    async costTable1(dataTable: DataTable) {
        await this.page.waitForTimeout(9000);
        const expectedData = dataTable.hashes();

        const tableRows = await this.table1.all();

        expect(tableRows.length).toBe(expectedData.length);

        for (let i = 0; i < expectedData.length; i++) {
            const row = tableRows[i];

            const category = await row.locator(this.items).textContent();
            const cost = await row.locator(this.costs).textContent();

            expect(category?.trim()).toBe(expectedData[i]['Category']);
            expect(cost?.trim()).toBe(expectedData[i]['Cost']);

        }
        expect((await this.total.textContent()).trim()).toBe('£931,836.00');
    }


    @Given('the user is on the other public sector funding page')
    async fundingPage(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Other sources of funding?");
        await this.addPartner.govRadioButtons("Yes");
        await this.commands.button("Save and continue").click();
        await this.commands.verifyTextOnPage("Other public sector funding?", this.PageHeading2);
    }

    @Given('the user is on the pcr request details page')
    async requestPage(){
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Edit");
    }
    
    @Given('the sees the agreement page')
    async agreementPage(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(9000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Partner agreement");

    }

    @Then('the user clicks mark as complete')
    async clickMarkAsComplete(){
        await this.page.waitForTimeout(5000);
        await this.pcr.markAsCompleteSection(true);
    }

    @Then("the project change request should be submitted.")
  async getSubmittedRequest() {
    await this.pcr.validateSubmittedPcrDetails("Request number", "1");
    await this.pcr.validateSubmittedPcrDetails("Request type", "Add a partner");
    await this.pcr.validateSubmittedPcrDetails("Request status", "Submitted to Monitoring Officer");
  }
}

