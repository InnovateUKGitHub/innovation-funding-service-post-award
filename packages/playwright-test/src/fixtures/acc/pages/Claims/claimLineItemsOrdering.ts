import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PageHeading } from "../../../../components/PageHeading";
import { DataTable } from "playwright-bdd";
import { UploadType } from "../../../../typings/files";
import { getLorem } from "../../../../components/lorem";

export
@Fixture("claimLineItemsOrdering")
class ClaimLineItemsOrdering {
    protected readonly page: Page;
    protected readonly commands: Commands;
    private readonly addCostButton: Locator;
    private readonly lineItemTable: string;
    private readonly lineItemDescription: Locator;
    private readonly lineItemCost: Locator;
    private readonly lineItemDesc: Locator;
    private readonly lineItemAmount: Locator;
    private readonly labourClaimed: Locator;
    private readonly overheadClaimed: Locator;
    private readonly lineItemTotal: Locator;

    constructor({
        page,
        commands,

    }: {
        page: Page;
        commands: Commands;

    }) {
        this.page = page;
        this.commands = commands;
        this.addCostButton = this.page.getByRole("button").filter({ hasText: "Add a cost" });
        this.lineItemTable = "table tbody tr";
        this.lineItemDescription = this.page.locator("//*[@class='govuk-input']");
        this.lineItemCost = this.page.locator("//*[@class='govuk-input govuk-table__cell--numeric']");
        this.lineItemDesc = this.page.locator("td.ifspa-claim-line-input-cell input[name*='description']");
        this.lineItemAmount = this.page.locator("td.govuk-table__cell--numeric input[name*='value']");
        this.labourClaimed = this.page.locator("(//span[@class='currency'])[3]");
        this.overheadClaimed = this.page.locator("//table[@class='govuk-table']/tbody[1]/tr[2]/td[4]/span[1]");
        this.lineItemTotal = this.page.locator("(//span[@class='currency'])[1]")

    }

    async addLineItems(times: number) {
        for (let i = 0; i < times; i++) {
            await this.addCostButton.click();
        }
    }

    async enterLabourLineItems(data: Array<{ description: string, cost: string }>): Promise<void> {
        const rows = this.page.locator(this.lineItemTable);

        for (let i = 0; i < data.length; i++) {
            const row = rows.nth(i);

            await row.locator(this.lineItemDescription).fill(data[i].description);

            await row.locator(this.lineItemCost).fill(data[i].cost);
        }
    }

    @Given('the user clicks add costs twenty five times')
    async addTwentyFiveLineItems() {
        for (let i = 0; i < 25; i++) {
            await this.addCostButton.click();
        }
    }

    @When('the user enters the following labour costs data:')
    async enterLabourCosts(dataTable: DataTable) {
        const tableData = dataTable.hashes().map(row => ({

            description: row.description.toString(),
            cost: row.cost.toString(),
        }));
        await this.enterLabourLineItems(tableData);
    }

    @Then('the labour labour costs claimed should be {string}')
    async totalLabourCosts(cost: string) {
        await expect((this.labourClaimed).textContent()).resolves.toBe(cost);
    }

    @Then('the overhead cost should be {string}')
    async totalOverheadCost(amount: string) {
        await expect((this.overheadClaimed).textContent()).resolves.toBe(amount);
    }
    @Given('the use sees the claim line item table below:')
    async getLineItemsTable(dataTable: DataTable) {
        await this.page.waitForTimeout(5000);

        const expectedData = dataTable.hashes();

        const tableRows = await this.page.locator("(//table[@class='govuk-table'])[1]//tbody/tr").all();

        expect(tableRows.length).toBe(expectedData.length);

        for (let i = 0; i < expectedData.length; i++) {
            const row = tableRows[i];

            const descriptionInput = row.locator(this.lineItemDesc);

            const costInput = row.locator(this.lineItemAmount);

            const descriptionText = await descriptionInput.getAttribute("value");
            const costText = await costInput.getAttribute("value");

            expect(descriptionText.trim()).toBe(expectedData[i].description);

            expect(costText.trim()).toBe(expectedData[i].cost);
        }
        const amount =  await this.lineItemTotal.textContent();
        expect(amount.trim()).toBe(amount);
    }

    @Given('the user creates additional line items below:')
    async addMoreLineItems(dataTable: DataTable) {
        await this.page.waitForTimeout(5000);
        await this.addLineItems(4);

        const tableRows = await this.page.locator("(//table[@class='govuk-table'])[1]//tbody/tr").all();

        const tableData = dataTable.hashes().map(row => ({
            description: row.description.toString(),
            cost: row.cost.toString(),
        }));

        const startIndex = tableRows.length - tableData.length;

        for (let i = 0; i < tableData.length; i++) {
            const newRow = tableRows[startIndex + i];

            const descriptionInput = newRow.locator(this.lineItemDescription);
            const costInput = newRow.locator(this.lineItemCost);

            await descriptionInput.fill(tableData[i].description);
            await costInput.fill(tableData[i].cost);
        }
    }

    @Given('the user clicks save and return to claim')
    async clickSaveReturnToClaims() {
        await this.commands.button("Save and return to claims").click();
    }
}

