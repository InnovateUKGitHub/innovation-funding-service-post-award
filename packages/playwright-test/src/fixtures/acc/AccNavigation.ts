import { Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { DashboardTile } from "../../components/DashboardTile";
import { ProjectCard } from "../../components/ProjectCard";
import { TestCache } from "../../helpers/TestCache";
import { ProjectState } from "../projectFactory/ProjectState";
import { AccIsLoaded } from "./AccIsLoaded";
import { Acc_Claims__c } from "@innovateuk/project-factory-two/sobjects/Acc_Claims__c";
import { Acc_Project__c } from "@innovateuk/project-factory-two/sobjects/Acc_Project__c";
export
@Fixture("accNavigation")
class AccNavigation {
  private readonly page: Page;
  private readonly projectState: ProjectState;
  private readonly testCache = new TestCache();
  private readonly accIsLoaded: AccIsLoaded;

  constructor({
    page,
    projectState,
    accIsLoaded,
  }: {
    page: Page;
    projectState: ProjectState;
    accIsLoaded: AccIsLoaded;
  }) {
    this.page = page;
    this.projectState = projectState;
    this.accIsLoaded = accIsLoaded;
  }

  @Given("the user is on the developer homepage")
  async gotoDeveloperHomepage() {
    await this.page.goto("/");
    await this.accIsLoaded.devToolsLoaded();
  }

  @Given("the user is on the project dashboard")
  async gotoProjectDashboard() {
    await this.gotoDeveloperHomepage();
    await this.accIsLoaded.selectProjectTile();
    await this.accIsLoaded.projectDashboardLoaded();
  }

  @Given("the user is on the project overview")
  async gotoProjectOverview() {
    await this.testCache.cache(
      ["gotoProjectOverview", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectDashboard();
        await ProjectCard.fromTitle(this.page, this.projectState.prefixedProjectNumber()).click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.projectOverviewLoaded();
  }

  /**
   * N.B. Project forecasts is for the MSP
   * For an FC view, see the Project Forecast page
   */
  @Given("the user is on the project forecasts")
  async gotoProjectForecasts() {
    await this.testCache.cache(
      ["gotoProjectForecasts", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Forecast").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.forecastsLoaded();
  }

  @Given("the user is on the claims dashboard")
  async gotoClaimsDashboard() {
    await this.testCache.cache(
      ["gotoClaimsDashboard", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Claims").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.claimsLoaded();
  }

  @Given("the user is on the finance summary page")
  async gotoFinanceSummary() {
    await this.testCache.cache(
      ["gotoFinanceSummary", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Finance summary").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.financeSummaryLoaded();
  }

  @Given("the user has navigated to the monitoring reports page")
  async gotoMonitoringReports() {
    await this.testCache.cache(
      ["gotoProjectForecasts", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Monitoring reports").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.moReportLoaded();
  }

  @Given("the user has navigated to the project change request page")
  async gotoProjectChangeRequests() {
    await this.testCache.cache(
      ["gotoProjectChangeRequests", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Project change requests").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.projectOnHoldLoaded();
  }

  @Given("the user has navigated to the project details page")
  async gotoProjectDetails() {
    await this.testCache.cache(
      ["gotoProjectDetails", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Project details").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.projectDetailsLoaded();
  }

  @Given("the user has navigated to {string} Partner information")
  async navigateToPartnerInformation(name: string) {
    await this.gotoProjectDetails();
    await this.accIsLoaded.navToPartnerDetails(name);
  }

  @Given("the user has navigated to the project documents page")
  async gotoProjectDocuments() {
    await this.testCache.cache(
      ["goToProjectDocuments", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Documents").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.projectDocumentsLoaded();
  }

  @Given("this user has navigated to the Claims page")
  async gotoClaimsPage() {
    await this.testCache.cache(
      ["goToClaimsPage", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Claims").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.accIsLoaded.devToolsLoaded();
    await this.accIsLoaded.claimsPageIsLoaded();
  }

  @Given("the user is on the prepare {string} claim summary page")
  async gotoClaimPrepareSummaryPageFromClaimTotalProjectPeriod(claimPeriodKey: string) {
    const claim = this.projectState.context[claimPeriodKey];
    const project = this.projectState.context.project;
    if (!(project instanceof Acc_Project__c)) throw new Error("Project is not of type Acc_Project__c");
    if (!(claim instanceof Acc_Claims__c)) throw new Error(`${claimPeriodKey} is not of type Acc_Claims__c`);

    await this.page.goto(
      `/projects/${project.Id}/claims/${claim.Acc_ProjectParticipant__c}/prepare/${claim.Acc_ProjectPeriodNumber__c}/summary`,
    );
  }

  @Given("the user is on the review {string} claim summary page")
  async gotoClaimReviewSummaryPageFromClaimTotalProjectPeriod(claimPeriodKey: string) {
    const claim = this.projectState.context[claimPeriodKey];
    const project = this.projectState.context.project;
    if (!(project instanceof Acc_Project__c)) throw new Error("Project is not of type Acc_Project__c");
    if (!(claim instanceof Acc_Claims__c)) throw new Error(`${claimPeriodKey} is not of type Acc_Claims__c`);

    await this.page.goto(
      `/projects/${project.Id}/claims/${claim.Acc_ProjectParticipant__c}/review/${claim.Acc_ProjectPeriodNumber__c}`,
    );
  }
}
