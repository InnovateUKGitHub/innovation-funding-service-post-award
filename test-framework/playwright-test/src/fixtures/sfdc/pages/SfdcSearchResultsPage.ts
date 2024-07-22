import { Fixture, Then } from "playwright-bdd/decorators";
import { ProjectState } from "../../projectFactory/ProjectState";
import { SfdcLightningPage } from "../SfdcLightningPage";
import { SfdcBasePage } from "./SfdcBasePage";
import { expect } from "@playwright/test";

export
@Fixture("sfdcSearchResultsPage")
class SfdcSearchResultsPage extends SfdcBasePage {
  public static create(
    { sfdcPage, projectState }: { sfdcPage: SfdcLightningPage; projectState: ProjectState },
    use: (x: SfdcSearchResultsPage) => Promise<void>,
  ) {
    use(new SfdcSearchResultsPage({ sfdcLightningPage: sfdcPage, projectState }));
  }

  @Then("the internal user sees the Search Results page")
  isPage(): Promise<void> {
    return expect(
      this.sfdcLightningPage.page.locator(".slds-nav-vertical__title").filter({ hasText: "Search Results" }),
    ).toBeVisible();
  }

  clickFirstSearchResult(): Promise<void> {
    return this.sfdcLightningPage.page.locator(".outputLookupLink:visible").first().click();
  }
}
