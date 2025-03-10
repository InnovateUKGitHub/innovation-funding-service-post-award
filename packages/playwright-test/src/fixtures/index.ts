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
import { ManageTeamMember } from "./acc/pages/PCRs/ManageTeamMember";
import { AccProjectKtp } from "./projectFactory/AccProjectKTP";
import { ApproveNewSubcontractor } from "./acc/pages/PCRs/approveNewSubcontractor";
import { RemovePartner } from "./acc/pages/PCRs/removePartner";
import { ProjectDetails } from "./acc/pages/ProjectDetails";
import { ProjectDocuments } from "./acc/pages/ProjectDocuments";
import { Validators } from "./validators";
import { ChangeProjectScope } from "./acc/pages/PCRs/changeScope";
import { ChangePartnerName } from "./acc/pages/PCRs/changePartnerName";
import { AccProjectWithoutFC } from "./projectFactory/AccProjectWithoutFC";
import { AccIsLoaded } from "./acc/AccIsLoaded";
import { ChangeProjectDuration } from "./acc/pages/PCRs/changeProjectDuration";
import { Acc1CypressDoNotTouch } from "./projectFactory/Acc1CypressDoNotTouch";
import { CrdClaims } from "./acc/pages/Claims/crdClaims";
import { AddPartner } from "./acc/pages/PCRs/addPartner";
import { AccClaimsDashboard } from "./acc/pages/Claims/AccClaimsDashboard";
import { AccFinanceSummary } from "./acc/pages/AccFinanceSummary";
import { AccProjectLoans } from "./projectFactory/AccProjectLoans";
import { LoanDrawdowns } from "./acc/pages/Loans/LoanDrawdowns";
import { LoanDrawdownChange } from "./acc/pages/PCRs/loanDrawdownChange";
import { AccProjectFinalClaim } from "./projectFactory/AccProjectFinalClaim";
import { SfdcExecuteApprovalProcessScript } from "./projectFactory/SfdcExecuteApprovalProcessScript";
import { SfdcSObject } from "./sfdc/SfdcSObject";
import { AccProjectCFI } from "./projectFactory/AccProjectCFI";
import { AddLeadPartner } from "./acc/pages/PCRs/addLeadPartner";

type AccFixtures = {
  // Pages
  developerHomepage: DeveloperHomepage;
  projectDashboard: ProjectDashboard;
  projectOverview: ProjectOverview;
  projectForecasts: ProjectForecasts;
  viewForecast: ViewForecast;
  monitoringReports: MonitoringReports;
  putProjectOnHold: PutProjectOnHold;
  manageTeamMember: ManageTeamMember;
  projectChangeRequests: ProjectChangeRequests;
  approveNewSubcontractor: ApproveNewSubcontractor;
  changeScope: ChangeProjectScope;
  removePartner: RemovePartner;
  projectDetails: ProjectDetails;
  projectDocuments: ProjectDocuments;
  changePartnerName: ChangePartnerName;
  changeProjectDuration: ChangeProjectDuration;
  crdClaims: CrdClaims;
  addPartner: AddPartner;
  accClaimsDashboard: AccClaimsDashboard;
  accFinanceSummary: AccFinanceSummary;
  loanDrawdowns: LoanDrawdowns;
  loanDrawdownChange: LoanDrawdownChange;
  addLeadPartner: AddLeadPartner

  // Misc
  accNavigation: AccNavigation;
  commands: Commands;
  validators: Validators;
  ktp: AccProjectKtp;
  accIsLoaded: AccIsLoaded;

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
  accProjectMulti: AccProjectMulti;
  accProjectKtp: AccProjectKtp;
  accProjectWithoutFc: AccProjectWithoutFC;
  acc1CypressDoNotTouch: Acc1CypressDoNotTouch;
  projectFactoryHelloWorld: ProjectFactoryHelloWorld;
  sfdcExecuteApprovalProcessScript: SfdcExecuteApprovalProcessScript;
  sfdcSObject: SfdcSObject;
  projectState: ProjectState;
  accProjectLoans: AccProjectLoans;
  accProjectFinalClaim: AccProjectFinalClaim;
  accProjectCFI: AccProjectCFI;
}

export const test = base.extend<AccFixtures, Workers>({
  // Pages
  developerHomepage: ({ page }, use) => use(new DeveloperHomepage({ page })),
  projectDashboard: ({ page }, use) => use(new ProjectDashboard({ page })),
  projectOverview: ({ page }, use) => use(new ProjectOverview({ page })),
  projectForecasts: ({ page, commands, accNavigation }, use) =>
    use(new ProjectForecasts({ page, commands, accNavigation })),
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
  projectDocuments: ({ page, commands, validators, accNavigation }, use) =>
    use(new ProjectDocuments({ page, commands, validators, accNavigation })),
  manageTeamMember: (
    { page, commands, accProjectKtp, projectChangeRequests, accUserSwitcher, accNavigation, projectState },
    use,
  ) =>
    use(
      new ManageTeamMember({
        page,
        commands,
        accProjectKtp,
        projectChangeRequests,
        accUserSwitcher,
        accNavigation,
        projectState,
      }),
    ),
  changePartnerName: ({ page, commands, projectChangeRequests, accNavigation, validators }, use) =>
    use(new ChangePartnerName({ page, commands, projectChangeRequests, accNavigation, validators })),
  changeProjectDuration: ({ page, commands, projectChangeRequests }, use) =>
    use(new ChangeProjectDuration({ page, commands, projectChangeRequests })),
  crdClaims: ({ page, commands, validators, accNavigation, viewForecast }, use) =>
    use(new CrdClaims({ page, commands, validators, accNavigation, viewForecast })),
  accClaimsDashboard: ({ page }, use) => use(new AccClaimsDashboard({ page })),
  accFinanceSummary: ({ page }, use) => use(new AccFinanceSummary({ page })),
  addPartner: ({ page, commands, projectChangeRequests, putProjectOnHold }, use) =>
    use(new AddPartner({ page, commands, projectChangeRequests, putProjectOnHold })),
  loanDrawdowns: ({ page, commands }, use) => use(new LoanDrawdowns({ page, commands })),
  loanDrawdownChange: ({ page, commands, projectChangeRequests, loanDrawdowns }, use) =>
    use(new LoanDrawdownChange({ page, commands, projectChangeRequests, loanDrawdowns })),
  addLeadPartner: ({ page, commands, projectChangeRequests, addPartner }, use) =>
    use(new AddLeadPartner({ page, commands, projectChangeRequests, addPartner })),
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
  sfdcExecuteApprovalProcessScript: [
    ({ sfdcApi, projectState }, use) => use(new SfdcExecuteApprovalProcessScript({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  accProjectKtp: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectKtp({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  accProjectWithoutFc: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectWithoutFC({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  acc1CypressDoNotTouch: [
    ({ sfdcApi, projectState }, use) => use(new Acc1CypressDoNotTouch({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  accProjectLoans: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectLoans({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  accProjectFinalClaim: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectFinalClaim({ sfdcApi, projectState })),
    { scope: "worker" },
  ],
  accProjectCFI: [
    ({ sfdcApi, projectState }, use) => use(new AccProjectCFI({ sfdcApi, projectState })),
    { scope: "worker" },
  ],

  // Misc
  accNavigation: ({ page, projectState, accIsLoaded }, use) =>
    use(
      new AccNavigation({
        page,
        projectState,
        accIsLoaded,
      }),
    ),
  accIsLoaded: ({ page, commands }, use) =>
    use(
      new AccIsLoaded({
        page,
        commands,
      }),
    ),
  projectState: [({ sfdcApi }, use) => use(new ProjectState({ sfdcApi })), { scope: "worker" }],
  commands: ({ page }, use) => use(new Commands({ page })),
  accUserSwitcher: ({ context, projectState, sfdcApi }, use) =>
    use(new AccUserSwitcher({ context, projectState, sfdcApi })),
  validators: ({ page, commands }, use) => use(new Validators({ page, commands })),
  // Salesforce (dot com)
  sfdcApi: [SfdcApi.create, { scope: "worker" }],
  sfdcPage: SfdcLightningPage.create,
  sfdcTab: SfdcLightningPage.createNewTab,
  sfdcIfspaAppDashboard: SfdcIfspaAppDashboard.create,
  sfdcIfspaAppAccProjectPage: SfdcIfspaAppAccProjectPage.create,
  sfdcNavigation: SfdcNavigation.create,
  sfdcSearchResultsPage: SfdcSearchResultsPage.create,
  sfdcSObject: [SfdcSObject.create, { scope: "worker" }],
});

export { AccFixtures };
