import { Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { DashboardTile } from "../../components/DashboardTile";
import { DevTools } from "../../components/DevTools";
import { ProjectCard } from "../../components/ProjectCard";
import { TestCache } from "../../helpers/TestCache";
import { ProjectState } from "../projectFactory/ProjectState";
import { DeveloperHomepage } from "./pages/DeveloperHomepage";
import { MonitoringReports } from "./pages/MonitoringReports";
import { ProjectDashboard } from "./pages/ProjectDashboard";
import { ProjectForecasts } from "./pages/ProjectForecasts";
import { ProjectOverview } from "./pages/ProjectOverview";
import { PutProjectOnHold } from "./pages/putProjectOnHold";

export
@Fixture("accNavigation")
class AccNavigation {
  private readonly page: Page;
  private readonly developerHomepage: DeveloperHomepage;
  private readonly projectDashboard: ProjectDashboard;
  private readonly projectOverview: ProjectOverview;
  private readonly projectForecasts: ProjectForecasts;
  private readonly monitoringReports: MonitoringReports;
  private readonly projectState: ProjectState;
  private readonly testCache = new TestCache();
  private readonly devtools: DevTools;
  private readonly putProjectOnHold: PutProjectOnHold;

  constructor({
    page,
    developerHomepage,
    projectDashboard,
    projectOverview,
    projectForecasts,
    projectState,
    monitoringReports,
    putProjectOnHold,
  }: {
    page: Page;
    developerHomepage: DeveloperHomepage;
    projectDashboard: ProjectDashboard;
    projectOverview: ProjectOverview;
    projectForecasts: ProjectForecasts;
    projectState: ProjectState;
    monitoringReports: MonitoringReports;
    putProjectOnHold: PutProjectOnHold;
  }) {
    this.page = page;
    this.developerHomepage = developerHomepage;
    this.projectDashboard = projectDashboard;
    this.projectOverview = projectOverview;
    this.projectForecasts = projectForecasts;
    this.projectState = projectState;
    this.monitoringReports = monitoringReports;
    this.putProjectOnHold = putProjectOnHold;
    this.devtools = new DevTools({ page });
  }

  @Given("the user is on the developer homepage")
  async gotoDeveloperHomepage() {
    await this.page.goto("/");
    await this.devtools.isLoaded();
  }

  @Given("the user is on the project dashboard")
  async gotoProjectDashboard() {
    await this.gotoDeveloperHomepage();
    await this.developerHomepage.selectProjectTile();
    await this.projectDashboard.isPage();
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

    await this.devtools.isLoaded();
    await this.projectOverview.isPage();
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

    await this.devtools.isLoaded();
    await this.projectForecasts.isPage();
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

    await this.devtools.isLoaded();
    await this.monitoringReports.isPage();
  }

  @Given("the user has navigated to the project change request page")
  async gotoProjectChangeRequests() {
    await this.testCache.cache(
      ["gotoProjectForecasts", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectOverview();
        await DashboardTile.fromTitle(this.page, "Project change requests").click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.devtools.isLoaded();
    await this.putProjectOnHold.isPage();
  }
}
