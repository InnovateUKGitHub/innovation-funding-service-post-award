import { Then, When } from "playwright-bdd/decorators";
import { SfdcLightningSearchButton } from "../../../components/sfdc/SfdcLightningSearchButton";
import { SfdcLightningPage } from "../SfdcLightningPage";
import { ProjectState } from "../../projectFactory/ProjectState";
import { SfdcLightningSearchDialogInstantResultItemComponent } from "../../../components/sfdc/SfdcLightningSearchDialogInstantResultItemComponent";

export abstract class SfdcBasePage {
  protected readonly sfdcLightningPage: SfdcLightningPage;
  protected readonly projectState: ProjectState;
  protected readonly searchButton: SfdcLightningSearchButton;
  protected readonly searchResults: SfdcLightningSearchDialogInstantResultItemComponent;

  constructor({
    sfdcLightningPage,
    projectState,
  }: {
    sfdcLightningPage: SfdcLightningPage;
    projectState: ProjectState;
  }) {
    this.sfdcLightningPage = sfdcLightningPage;
    this.projectState = projectState;
    this.searchButton = SfdcLightningSearchButton.create(sfdcLightningPage);
    this.searchResults = SfdcLightningSearchDialogInstantResultItemComponent.create(sfdcLightningPage);
  }

  abstract isPage(): Promise<void>;

  @When("the internal user clicks on the search button")
  public async clickSearchButton() {
    await this.searchButton.click();
  }

  @When("the internal user searches for the project")
  public async enterProjectNumber() {
    await this.sfdcLightningPage.page.keyboard.type(this.projectState.prefixedProjectNumber());
  }

  public async clickShowMoreResults() {
    await this.searchResults.get().filter({ hasText: "Show more results for" }).click();
  }

  @When("the internal user clicks on the first project search result")
  public async omnibarClickFirstSearchResult() {
    await this.searchResults.get().first().click();
  }

  @Then("the internal user clicks on their profile icon")
  async userClicksOnTheirProfileIcon() {
    await this.sfdcLightningPage.page.locator(".branding-userProfile-button").click();
    await this.sfdcLightningPage.page.waitForTimeout(2000);
  }
}
