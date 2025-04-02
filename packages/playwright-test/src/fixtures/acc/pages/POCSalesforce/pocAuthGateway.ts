import { expect, Locator, Page } from "@playwright/test";
import { Fixture, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { DataTable } from "playwright-bdd";

export
@Fixture("pocAuthGateway")
class PocAuthGateway {
  protected readonly page: Page;
  protected readonly commands: Commands;

  private readonly appLauncher: Locator;
  private readonly appLauncherSearch: Locator;
  private readonly authGatewayHeading: Locator;
  private readonly saveButton: Locator;
  private readonly applicationSuffix: string;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;

    this.appLauncher = this.page.getByLabel("App");
    this.appLauncherSearch = this.page.getByLabel("Search apps and items...");
    this.saveButton = this.page.getByRole("button").filter({ hasText: "Save" });
    this.authGatewayHeading = this.page.getByRole("heading").filter({ hasText: "Authorisation Gateway" });
    this.applicationSuffix = this.suffixGenerator();
  }

  @When("the user navigates to Authorisation Gateway")
  async navToAuthGateway() {
    await this.appLauncher.click();
    await this.page.waitForTimeout(5000);
    await this.appLauncher.getByRole("button").filter({ hasText: "View All" }).click();
    await this.page.getByRole("dialog").getByLabel("Search apps or items...").fill("Authorisation Gateway");
    await this.page.waitForTimeout(3000);
    await this.getByDataName("Authorisation Gateway").getByRole("link").click();
    await expect(this.authGatewayHeading).toBeVisible();
  }
  @When("user navigate to Authorisation gateway object")
  async navtoAuthGatewayobject() {
    await this.page.getByRole("navigation").getByRole("listitem").getByTitle("Authorisation Gateway").click();
    await this.page.getByRole("button").filter({ hasText: "New" }).click();
    await this.page.getByLabel("a1 Name of Funding Opportunity").fill(`SV_ACC${this.applicationSuffix}`);
    await this.page.getByLabel("a2 Name of Innovate UK Submission Owner").fill("AGILN");
    await this.page.waitForTimeout(3000);
    await this.page.getByLabel("a2 Name of Innovate UK Submission Owner").click();
    await this.page
      .locator("lightning-base-combobox-item")
      .filter({ hasText: /^AGILN$/ })
      .click();
    //select the save button
    await this.saveButton.click();
    await expect(this.page.getByTitle("Design Draft")).toHaveText("Design Draft");
    await this.page.getByTitle("Edit SU1 Select from the following").click();
    await this.page.waitForTimeout(2000);
    await this.clickDropdownBox("RecordAward_type__cField");
    await this.page.waitForTimeout(2000);
    await this.clickDropdownItem("RecordAward_type__cField", "A. This is a new initiative");
    await this.clickDropdownBox("RecordA6_Is_this_part_of_existing_IFS_Award__cField");
    await this.clickDropdownItem("RecordA6_Is_this_part_of_existing_IFS_Award__cField", "Yes");
    await this.addOptionFromDualList("RecordSU6_2_Sectors_to_be_funded_cField", "Copper production");
    await this.removeOptionFromDualList("RecordSU6_2_Sectors_to_be_funded_cField", "Copper production");
  }
  /**
   * METHODS
   */

  //Tool for dropdownboxes:
  async clickDropdownBox(fieldId: string) {
    await this.getByFieldID(fieldId).locator("lightning-base-combobox").click();
  }

  async clickDropdownItem(fieldId: string, filterText: string) {
    await this.getByFieldID(fieldId).locator("lightning-base-combobox-item").filter({ hasText: filterText }).click();
  }

  //Tools for dual picklists

  async addOptionFromDualList(fieldId: string, option: string) {
    await this.getByFieldID(fieldId)
      .getByRole("listbox")
      .nth(0)
      .getByRole("option")
      .filter({ hasText: option })
      .click();
    await this.page.getByTitle("Move to chosen").click();
  }
  async removeOptionFromDualList(fieldId: string, option: string) {
    await this.getByFieldID(fieldId)
      .getByRole("listbox")
      .nth(1)
      .getByRole("option")
      .filter({ hasText: option })
      .click();
    await this.page.getByTitle("Move to available").click();
  }

  //Tools to locate elements using a SF-specific id.
  getByDataName(label: string) {
    return this.page.locator(`[data-name="${label}"]`);
  }

  getByFieldID(label: string) {
    return this.page.locator(`[data-field-id="${label}"]`);
  }

  getByDataComponentID(id: string) {
    return this.page.locator(`[data-component-id="${id}"]`);
  }

  async checkNavBar(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await expect(this.page.getByTitle(row["tab"]).filter({ hasText: row["tab"] })).toBeVisible();
    }
  }

  getTab(tabName: string) {
    return this.page.getByRole("tablist").getByRole("tab").filter({ hasText: tabName });
  }

  async getProjectTabData(apiName: string, label: string) {
    let fieldId = `Record${apiName}Field`;
    await expect(this.getByFieldID(fieldId).getByRole("listitem").filter({ hasText: label })).toBeVisible();
  }

  suffixGenerator() {
    return String(Math.floor(Math.random() * 9999 + 10000 + 1));
  }
}
