import { Fixture, Given, When } from "playwright-bdd/decorators";
import { TestCache } from "../../helpers/TestCache";
import { ProjectState } from "../projectFactory/ProjectState";
import { SfdcIfspaAppAccProjectPage } from "./pages/SfdcIfspaAppAccProjectPage";
import { SfdcIfspaAppDashboard } from "./pages/SfdcIfspaAppDashboard";
import { SfdcLightningPage } from "./SfdcLightningPage";
import { SfdcSearchResultsPage } from "./pages/SfdcSearchResultsPage";
import { SfdcApi } from "./SfdcApi";
import { BaseCrndProjectScriptContext } from "@innovateuk/project-factory-two/scripts/BaseCrndProjectScript";

export
@Fixture("sfdcNavigation")
class SfdcNavigation {
  private readonly sfdcPage: SfdcLightningPage;
  private readonly sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
  private readonly sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
  private readonly sfdcSearchResultsPage: SfdcSearchResultsPage;
  private readonly projectState: ProjectState;
  private readonly testCache = new TestCache();
  private readonly sfdcApi: SfdcApi;

  public static async create(
    {
      sfdcPage,
      sfdcIfspaAppDashboard,
      sfdcIfspaAppAccProjectPage,
      sfdcSearchResultsPage,
      projectState,
      sfdcApi,
    }: {
      sfdcPage: SfdcLightningPage;
      sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
      sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
      sfdcSearchResultsPage: SfdcSearchResultsPage;
      projectState: ProjectState;
      sfdcApi: SfdcApi;
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
        sfdcApi,
      }),
    );
  }

  constructor({
    sfdcPage,
    sfdcIfspaAppDashboard,
    sfdcIfspaAppAccProjectPage,
    sfdcSearchResultsPage,
    projectState,
    sfdcApi,
  }: {
    sfdcPage: SfdcLightningPage;
    sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
    sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
    sfdcSearchResultsPage: SfdcSearchResultsPage;
    projectState: ProjectState;
    sfdcApi: SfdcApi;
  }) {
    this.sfdcPage = sfdcPage;
    this.sfdcIfspaAppDashboard = sfdcIfspaAppDashboard;
    this.sfdcIfspaAppAccProjectPage = sfdcIfspaAppAccProjectPage;
    this.sfdcSearchResultsPage = sfdcSearchResultsPage;
    this.projectState = projectState;
    this.sfdcApi = sfdcApi;
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

  @When("the user accesses the Project Factory project in Salesforce")
  async accessProject() {
    const context = this.projectState.context as BaseCrndProjectScriptContext;
    const iD = String(context.project.Acc_ProjectNumber__c);
    console.log(iD);

    type QueryProjectId = {
      totalSize: number;
      done: boolean;
      records: {
        attributes: { type: string; url: string };
        Id: string;
      }[];
    };
    const conn = await this.sfdcApi.getTsforceConnection();
    await conn.executeApex({ query: "System.debug('Run an Apex query');" });

    const response: QueryProjectId = await conn.executeSOQL({
      query: `SELECT Id FROM Acc_Project__c WHERE Acc_ProjectNumber__c = '${iD}'`,
    });

    const myJSON = JSON.stringify(response);
    console.log(myJSON);
    const projectId = response.records[0].Id;
    let path = String(`/lightning/r/Acc_Project__c/${projectId}/view`);
    console.log(iD);
    await this.sfdcPage.loginAndGoto(path);
  }
}
