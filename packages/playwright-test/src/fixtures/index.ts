// fixtures.ts
import { test as base } from "playwright-bdd";
import { DeveloperHomepage } from "./acc/pages/DeveloperHomepage";
import { ProjectDashboard } from "./acc/pages/ProjectDashboard";
import { AccProjectBase } from "./projectFactory/AccProjectBase";
import { AccProjectMulti } from "./projectFactory/AccProjectMulti";
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
import { ProjectChangeRequests } from "./acc/pages/PCRs/ProjectChangeRequests";
import { PutProjectOnHold } from "./acc/pages/PCRs/putProjectOnHold";
import { ApproveNewSubcontractor } from "./acc/pages/PCRs/approveNewSubcontractor";
import { RemovePartner } from "./acc/pages/PCRs/removePartner";
import { ProjectDetails } from "./acc/pages/ProjectDetails";
import { ProjectDocuments } from "./acc/pages/ProjectDocuments";
import { Validators } from "./validators";
import { ChangeProjectScope } from "./acc/pages/PCRs/changeScope";
import { IfsLoginPage } from "./ifs-auth/IfsLoginPage";
import { IfsAuthNavigation } from "./ifs-auth/IfsAuthNavigation";
import { Environment } from "./Environment";

type AccFixtures = {
  // Pages
  developerHomepage: DeveloperHomepage;
  projectDashboard: ProjectDashboard;
  projectOverview: ProjectOverview;
  projectForecasts: ProjectForecasts;
  viewForecast: ViewForecast;
  monitoringReports: MonitoringReports;
  putProjectOnHold: PutProjectOnHold;
  projectChangeRequests: ProjectChangeRequests;
  approveNewSubcontractor: ApproveNewSubcontractor;
  changeScope: ChangeProjectScope;
  removePartner: RemovePartner;
  projectDetails: ProjectDetails;
  projectDocuments: ProjectDocuments;

  // Misc
  accNavigation: AccNavigation;
  commands: Commands;
  validators: Validators;

  // ACC
  accUserSwitcher: AccUserSwitcher;

  // Salesforce (dot com)
  sfdcPage: SfdcLightningPage;
  sfdcTab: SfdcLightningPage;
  sfdcIfspaAppDashboard: SfdcIfspaAppDashboard;
  sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage;
  sfdcNavigation: SfdcNavigation;
  sfdcSearchResultsPage: SfdcSearchResultsPage;

  // IFS Auth
  ifsAuthNavigation: IfsAuthNavigation;
  ifsLoginPage: IfsLoginPage;
};

interface Workers {
  sfdcApi: SfdcApi;
  accProjectBase: AccProjectBase;
  accProjectMulti: AccProjectMulti;
  projectFactoryHelloWorld: ProjectFactoryHelloWorld;
  projectState: ProjectState;
  environment: Environment;
}

export const test = base.extend<AccFixtures, Workers>({
  // Pages
  developerHomepage: ({ page }, use) => use(new DeveloperHomepage({ page })),
  projectDashboard: ({ page }, use) => use(new ProjectDashboard({ page })),
  projectOverview: ({ page }, use) => use(new ProjectOverview({ page })),
  projectForecasts: ({ page, commands }, use) => use(new ProjectForecasts({ page, commands })),
  viewForecast: ({ page, commands }, use) => use(new ViewForecast({ page, commands })),
  projectChangeRequests: ({ page, commands }, use) => use(new ProjectChangeRequests({ page, commands })),
  putProjectOnHold: ({ page, commands, projectChangeRequests }, use) =>
    use(new PutProjectOnHold({ page, commands, projectChangeRequests })),
  monitoringReports: ({ page, commands }, use) => use(new MonitoringReports({ page, commands })),
  approveNewSubcontractor: ({ page, commands, projectChangeRequests }, use) =>
    use(new ApproveNewSubcontractor({ page, commands, projectChangeRequests })),
  changeScope: ({ page, commands, projectChangeRequests, validators }, use) =>
    use(new ChangeProjectScope({ page, commands, projectChangeRequests, validators })),
  removePartner: ({ page, commands, projectChangeRequests, validators }, use) =>
    use(new RemovePartner({ page, commands, projectChangeRequests, validators })),
  projectDetails: ({ page, commands }, use) => use(new ProjectDetails({ page, commands })),
  projectDocuments: ({ page, commands, validators }, use) => use(new ProjectDocuments({ page, commands, validators })),

  // Project Factory
  accProjectBase: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectBase({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  accProjectMulti: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectMulti({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  projectFactoryHelloWorld: [
    ({ sfdcApi, projectState }, use) => use(new ProjectFactoryHelloWorld({ sfdcApi, projectState })),
    { scope: "worker" },
  ],

  // Misc
  accNavigation: (
    {
      page,
      developerHomepage,
      projectDashboard,
      projectOverview,
      projectForecasts,
      projectState,
      monitoringReports,
      putProjectOnHold,
      projectDetails,
      projectDocuments,
    },
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
        putProjectOnHold,
        projectDetails,
        projectDocuments,
      }),
    ),
  projectState: [({}, use) => use(new ProjectState()), { scope: "worker" }],
  commands: ({ page }, use) => use(new Commands({ page })),
  accUserSwitcher: (
    { context, projectState, sfdcApi, accNavigation, ifsAuthNavigation, ifsLoginPage, environment },
    use,
  ) =>
    use(
      new AccUserSwitcher({
        context,
        projectState,
        sfdcApi,
        accNavigation,
        ifsAuthNavigation,
        ifsLoginPage,
        environment,
      }),
    ),
  validators: ({ page, commands }, use) => use(new Validators({ page, commands })),

  // Salesforce (dot com)
  sfdcApi: [SfdcApi.create, { scope: "worker" }],
  sfdcPage: SfdcLightningPage.create,
  sfdcTab: SfdcLightningPage.createNewTab,
  sfdcIfspaAppDashboard: SfdcIfspaAppDashboard.create,
  sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage.create,
  sfdcNavigation: SfdcNavigation.create,
  sfdcSearchResultsPage: SfdcSearchResultsPage.create,

  // IFS Auth
  ifsAuthNavigation: IfsAuthNavigation.create,
  ifsLoginPage: IfsLoginPage.create,

  // Environment
  environment: [({}, use) => use(new Environment()), { scope: "worker" }],
});

export { AccFixtures };
