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
@Fixture("addMultiplePartners")
class AddMultiplePartners {
    protected readonly page: Page;
    protected readonly commands: Commands;
    protected readonly pcr: ProjectChangeRequests;
    protected readonly addPartner: AddPartner;
    private readonly PageHeading: Locator;
    private readonly removeFunding: Locator;
    private readonly fundingTotal: Locator;
    private readonly calculatedOverhead: Locator;
    private readonly addTypes: Locator;
    private readonly tsbRef: Locator;
    private readonly govInput: Locator;

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
        this.PageHeading = this.page.locator("//h2[normalize-space()='Organisation']");
        this.removeFunding = this.page.locator("//tbody/tr[20]/td[4]/button[1]");
        this.fundingTotal = this.page.locator("//span[@class='currency']");
        this.calculatedOverhead = this.page.locator("//input[@id='value']");
        this.addTypes = this.page.locator("//a[normalize-space()='Add types']");
        this.tsbRef = this.page.locator("//input[@id='tsb-reference']");
        this.govInput = this.page.locator("//*[@type='text']");

    }

    @When('the user completes the new partner info')
    async newPartnerInfo() {
        await this.addPartner.govRadioButtons("Collaborator");
        await this.addPartner.govRadioButtons("No");
        await this.addPartner.govRadioButtons("Business");
    }

    @Then('the user selects calculated Overhead')
    async calculatedOverheads() {
        await this.addPartner.govRadioButtons("Calculated");
        await this.calculatedOverhead.fill("£2000");
        await this.commands.button("Save and return to project costs").click();
    }

    @When('the user removes one line of funding')
    async removeFund() {
        await this.removeFunding.click();
    }

    @Then('the total remaning fund should be {string}')
    async getTotalFunding(amount: string) {
        expect((await this.fundingTotal.textContent()).trim()).toBe(amount);
    }

    @Given('the user is on the Other sources of funding? page')
    async otherFundingSource(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(7000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
        await this.page.waitForTimeout(4000);
        await this.addPartner.editByVisibleText("Other sources of funding?");
    }

    @Given('the user amends the details')
    async amendDetails(){
        await this.page.waitForTimeout(7000);
        await this.addPartner.govRadioButtons("No");
        await this.commands.button("Save and return to summary").click()     
    }

    @When('the user navigates to the Other sources of funding? page followed by ammending the details')
    async updateTheFundingDetails(){
        await this.page.waitForTimeout(7000);
        await this.addPartner.editByVisibleText("Other sources of funding?");
        await this.addPartner.govRadioButtons("Yes");
        await this.commands.button("Save and continue").click();
        expect((await this.fundingTotal.textContent()).trim()).toBe("£12,425.21");
        await this.commands.button("Save and return to summary").click()   
    }

    @Given('the user is on the summary page')
    async summaryPage() {
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner (BLUE # STUDIO LTD)");
    }

    @Given('the user sees the request details')
    async valaidateRequestDetails() {
        await this.pcr.validatePcrTaskList("1. Give us information", "Add a partner (BLUE # STUDIO LTD)Complete");
        await this.pcr.validatePcrTaskList("1. Give us information", "Complete");
        await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "Provide reasons to Innovate UK");
        await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "Complete");
        await this.pcr.validatePcrDetails("1", "Add a partner");
    }

    @When('the user clicks add type')
    async clickAddTypes() {
        await this.addTypes.click();
        await this.commands.selectPcrType("Add a partner");
        await this.commands.button("Add to request").click();
    }

    @When('the user selects the newly created partner')
    async newPartner() {
        await this.page.waitForTimeout(5000);
        await this.pcr.clickTaskTodo("Add a partner");
        await this.addPartner.govRadioButtons("Collaborator");
        await this.addPartner.govRadioButtons("No");
        await this.addPartner.govRadioButtons("Research");
        await this.commands.button("Save and return to summary").click();
        await this.page.waitForSelector("//h2[normalize-space()='Organisation']");
        await this.commands.verifyTextOnPage("Organisation", this.PageHeading);
    }

    @Given('the user is on the add finance page')
    async addFinanceContact(){
        await this.pcr.clickTaskTodo("Edit");
        await this.page.waitForTimeout(5000);
        await this.pcr.validatePcrTaskList("1. Give us information", "Add a partner (BLUE # STUDIO LTD)Complete");
        await this.pcr.validatePcrTaskList("1. Give us information", "Complete");
        await this.pcr.validatePcrTaskList("1. Give us information", "Add a partner (Swindon University)");
        await this.pcr.validatePcrTaskList("1. Give us information", "Incomplete");
        await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "Complete");
        await this.pcr.clickTaskTodo("Add a partner (Swindon University)");
        await this.addPartner.editByVisibleText("Phone number");
    }

    @Given('the user enter the tsb reference {string}')
    async enterTsbRef(tsbRef: string){
        await this.tsbRef.fill(tsbRef);
        await this.govInput.nth(1).fill("£10000");
    }

    @Then('the user sees the pcr summary')
    async getSummaryPage(){
        await this.page.waitForTimeout(5000);
        await this.pcr.validatePcrTaskList("1. Give us information", "Add a partner (BLUE # STUDIO LTD)Complete");
        await this.pcr.validatePcrTaskList("1. Give us information", "Complete");
        await this.pcr.validatePcrTaskList("1. Give us information", "Add a partner (Swindon University)");
        await this.pcr.validatePcrTaskList("1. Give us information", "Complete");
        await this.pcr.validatePcrTaskList("2. Explain why you want to make the changes", "Complete");
    }
}
