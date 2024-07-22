import { Fixture, Given } from "playwright-bdd/decorators";
import { TestCache } from "../../helpers/TestCache";
import { ProjectState } from "../projectFactory/ProjectState";
import { SfdcIfspaAppAccProjectPage } from "./pages/SfdcIfspaAppAccProjectPage";
import { SfdcIfspaAppDashboard } from "./pages/SfdcIfspaAppDashboard";
import { SfdcLightningPage } from "./SfdcLightningPage";
import { SfdcSearchResultsPage } from "./pages/SfdcSearchResultsPage";

export
@Fixture("sfdcNavigation")
class SfdcNavigation {
  private readonly sfdcPage: SfdcLightningPage;
  private readonly sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
  private readonly sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
  private readonly sfdcSearchResultsPage: SfdcSearchResultsPage;
  private readonly projectState: ProjectState;
  private readonly testCache = new TestCache();

  public static async create(
    {
      sfdcPage,
      sfdcIfspaAppDashboard,
      sfdcIfspaAppAccProjectPage,
      sfdcSearchResultsPage,
      projectState,
    }: {
      sfdcPage: SfdcLightningPage;
      sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
      sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
      sfdcSearchResultsPage: SfdcSearchResultsPage;
      projectState: ProjectState;
    },
    use: (x: SfdcNavigation) => Promise<void>,
  ) {
    use(
      new SfdcNavigation({
        sfdcPage,
        sfdcIfspaAppDashboard,
        sfdcIfspaAppAccProjectPage,
        sfdcSearchResultsPage,
        projectState,
      }),
    );
  }

  constructor({
    sfdcPage,
    sfdcIfspaAppDashboard,
    sfdcIfspaAppAccProjectPage,
    sfdcSearchResultsPage,
    projectState,
  }: {
    sfdcPage: SfdcLightningPage;
    sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
    sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
    sfdcSearchResultsPage: SfdcSearchResultsPage;
    projectState: ProjectState;
  }) {
    this.sfdcPage = sfdcPage;
    this.sfdcIfspaAppDashboard = sfdcIfspaAppDashboard;
    this.sfdcIfspaAppAccProjectPage = sfdcIfspaAppAccProjectPage;
    this.sfdcSearchResultsPage = sfdcSearchResultsPage;
    this.projectState = projectState;
  }

  @Given("the internal user is on the salesforce lightning page")
  async gotoLightningHomepage() {
    await this.sfdcPage.loginAndGoto("/lightning/page/home");
    await this.sfdcIfspaAppDashboard.isPage();
  }

  @Given("the internal user is on the project flexipage")
  async gotoProjectOverview() {
    await this.testCache.cache(
      ["gotoProjectFlexipage", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoLightningHomepage();
        await this.sfdcIfspaAppDashboard.clickSearchButton();
        await this.sfdcIfspaAppDashboard.enterProjectNumber();
        await this.sfdcIfspaAppDashboard.clickShowMoreResults();
        await this.sfdcSearchResultsPage.isPage();
        await this.sfdcSearchResultsPage.clickFirstSearchResult();
        return this.sfdcPage.page.url();
      },
      async url => {
        await this.sfdcPage.page.goto(url);
      },
    );

    await this.sfdcIfspaAppAccProjectPage.isPage();
  }
}
