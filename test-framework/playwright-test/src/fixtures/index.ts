// fixtures.ts
import { test as base } from "playwright-bdd";
import { DeveloperHomepage } from "./acc/pages/DeveloperHomepage";
import { ProjectDashboard } from "./acc/pages/ProjectDashboard";
import { AccProjectBase } from "./projectFactory/AccProjectBase";
import { ProjectFactoryHelloWorld } from "./projectFactory/ProjectFactoryHelloWorld";
import { AccNavigation } from "./acc/AccNavigation";
import { ProjectState } from "./projectFactory/ProjectState";
import { ProjectOverview } from "./acc/pages/ProjectOverview";
import { ProjectForecasts } from "./acc/pages/ProjectForecasts";
import { Commands } from "./Commands";
import { ViewForecast } from "./acc/pages/ViewForecast";
import { MonitoringReports } from "./acc/pages/MonitoringReports";
import { SfdcLightningPage } from "./sfdc/SfdcLightningPage";
import { SfdcApi } from "./sfdc/SfdcApi";
import { SfdcIfspaAppDashboard } from "./sfdc/pages/SfdcIfspaAppDashboard";
import { AccUserSwitcher } from "./acc/AccUserSwitcher";
import { SfdcIfspaAppAccProjectPage } from "./sfdc/pages/SfdcIfspaAppAccProjectPage";
import { SfdcNavigation } from "./sfdc/SfdcNavigation";
import { SfdcSearchResultsPage } from "./sfdc/pages/SfdcSearchResultsPage";
import { ProjectChangeRequests } from "./acc/pages/ProjectChangeRequests";

type AccFixtures = {
  // Pages
  developerHomepage: DeveloperHomepage;
  projectDashboard: ProjectDashboard;
  projectOverview: ProjectOverview;
  projectForecasts: ProjectForecasts;
  viewForecast: ViewForecast;
  monitoringReports: MonitoringReports;
  projectChangeRequests: ProjectChangeRequests;

  // Misc
  accNavigation: AccNavigation;
  commands: Commands;

  // ACC
  accUserSwitcher: AccUserSwitcher;

  // Salesforce (dot com)
  sfdcPage: SfdcLightningPage;
  sfdcTab: SfdcLightningPage;
  sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
  sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
  sfdcNavigation: SfdcNavigation;
  sfdcSearchResultsPage: SfdcSearchResultsPage;
};

interface Workers {
  sfdcApi: SfdcApi;
  accProjectBase: AccProjectBase;
  projectFactoryHelloWorld: ProjectFactoryHelloWorld;
  projectState: ProjectState;
}

export const test = base.extend<AccFixtures, Workers>({
  // Pages
  developerHomepage: ({ page }, use) => use(new DeveloperHomepage({ page })),
  projectDashboard: ({ page }, use) => use(new ProjectDashboard({ page })),
  projectOverview: ({ page }, use) => use(new ProjectOverview({ page })),
  projectForecasts: ({ page, commands }, use) => use(new ProjectForecasts({ page, commands })),
  viewForecast: ({ page, commands }, use) => use(new ViewForecast({ page, commands })),
  monitoringReports: ({ page }, use) => use(new MonitoringReports({ page })),
  projectChangeRequests: ({ page }, use) => use(new ProjectChangeRequests({ page })),

  
  // Project Factory
  accProjectBase: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectBase({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  projectFactoryHelloWorld: [
    ({ sfdcApi, projectState }, use) => use(new ProjectFactoryHelloWorld({ sfdcApi, projectState })),
    { scope: "worker" },
  ],

  // Misc
  accNavigation: (
    { page, developerHomepage, projectDashboard, projectOverview, projectForecasts, projectState, monitoringReports, projectChangeRequests },
    use,
  ) =>
    use(
      new AccNavigation({
        page,
        developerHomepage,
        projectDashboard,
        projectOverview,
        projectForecasts,
        projectState,
        monitoringReports,
        projectChangeRequests,
      }),
    ),
  projectState: [({}, use) => use(new ProjectState()), { scope: "worker" }],
  commands: ({ page }, use) => use(new Commands({ page })),
  accUserSwitcher: ({ page, context, projectState }, use) => use(new AccUserSwitcher({ page, context, projectState })),
  // Salesforce (dot com)
  sfdcApi: [SfdcApi.create, { scope: "worker" }],
  sfdcPage: SfdcLightningPage.create,
  sfdcTab: SfdcLightningPage.createNewTab,
  sfdcIfspaAppDashboard: SfdcIfspaAppDashboard.create,
  sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage.create,
  sfdcNavigation: SfdcNavigation.create,
  sfdcSearchResultsPage: SfdcSearchResultsPage.create,
});

export { AccFixtures };
