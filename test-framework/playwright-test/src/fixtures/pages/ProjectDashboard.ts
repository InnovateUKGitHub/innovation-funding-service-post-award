import { Page, expect } from "@playwright/test";
import { Fixture, Given, When, Then } from "playwright-bdd/decorators";
import { BackButton } from "../../components/BackButton";
import { PageHeading } from "../../components/PageHeading";

export
@Fixture("projectDashboard")
class ProjectDashboard {
  protected readonly page: Page;
  private readonly pageTitle: PageHeading;
  private readonly backButton: BackButton;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.pageTitle = PageHeading.fromTitle(page, "Dashboard");
    this.backButton = new BackButton({ page });
  }

  // @When("the user goes back a page")
  // async back() {
  //   await this.backButton.click();
  // }

  @Then("the user sees the project dashboard")
  async isPage() {
    await expect(this.pageTitle.get()).toBeVisible();
  }
}
