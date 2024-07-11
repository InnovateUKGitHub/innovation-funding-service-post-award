import { Fixture, Given } from "playwright-bdd/decorators";
import { Page } from "@playwright/test";
import { DeveloperHomepage } from "./pages/DeveloperHomepage";
import { ProjectDashboard } from "./pages/ProjectDashboard";
import { CypressCache } from "../helpers/CypressCache";
import { ProjectState } from "./projectFactory/ProjectState";
import { DashboardCard } from "../components/DashboardCard";
import { ProjectOverview } from "./pages/ProjectOverview";
import { ProjectForecasts } from "./pages/ProjectForecasts";
import { DashboardTile } from "../components/DashboardTile";

export
@Fixture("accNavigation")
class AccNavigation {
  private readonly page: Page;
  private readonly developerHomepage: DeveloperHomepage;
  private readonly projectDashboard: ProjectDashboard;
  private readonly projectOverview: ProjectOverview;
  private readonly projectForecasts: ProjectForecasts;
  private readonly cyCache = new CypressCache();
  private readonly projectState: ProjectState;

  constructor({
    page,
    developerHomepage,
    projectDashboard,
    projectOverview,
    projectForecasts,
    projectState,
  }: {
    page: Page;
    developerHomepage: DeveloperHomepage;
    projectDashboard: ProjectDashboard;
    projectOverview: ProjectOverview;
    projectForecasts: ProjectForecasts;
    projectState: ProjectState;
  }) {
    this.page = page;
    this.developerHomepage = developerHomepage;
    this.projectDashboard = projectDashboard;
    this.projectOverview = projectOverview;
    this.projectForecasts = projectForecasts;
    this.projectState = projectState;
  }

  @Given("the user is on the developer homepage")
  async gotoDeveloperHomepage() {
    await this.page.goto("/");
  }

  @Given("the user is on the project dashboard")
  async gotoProjectDashboard() {
    await this.gotoDeveloperHomepage();
    await this.developerHomepage.selectProjectTile();
    await this.projectDashboard.isPage();
  }

  @Given("the user is on the project overview")
  async gotoProjectOverview() {
    await this.cyCache.cache(
      ["gotoProjectOverview", this.projectState.prefixedProjectNumber()],
      async () => {
        await this.gotoProjectDashboard();
        await DashboardCard.fromTitle(this.page, this.projectState.prefixedProjectNumber()).click();
        return this.page.url();
      },
      async url => {
        await this.page.goto(url);
      },
    );

    await this.projectOverview.isPage();
  }

  /**
   * N.B. Project forecasts is for the MSP
   * For an FC view, see the Project Forecast page
   */
  @Given("the user is on the project forecasts")
  async gotoProjectForecasts() {
    await this.cyCache.cache(
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

    await this.projectForecasts.isPage();
  }
}
