import { Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { BackButton } from "../../../components/BackButton";
import { PageHeading } from "../../../components/PageHeading";
import { DashboardTile } from "../../../components/DashboardTile";

export
@Fixture("projectOverview")
class ProjectOverview {
  protected readonly page: Page;
  private readonly pageTitle: PageHeading;
  private readonly backButton: BackButton;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.pageTitle = PageHeading.fromTitle(page, "Project overview");
    this.backButton = new BackButton({ page });
  }

  // @When("the user goes back a page")
  // async back() {
  //   await this.backButton.click();
  // }

  @When("the user selects the {string} tile")
  async selectTile(tileName: string) {
    await DashboardTile.fromTitle(this.page, tileName).click();
  }

  @Then("the user sees the project overview")
  async isPage() {
    await expect(this.pageTitle.get()).toBeVisible();
  }
}
