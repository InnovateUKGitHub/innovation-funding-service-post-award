import { BroadcastPageRoute } from "@ui/pages/broadcasts/broadcast.page";
import { AllClaimsDashboardRoute } from "@ui/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimDetailDocumentsRoute } from "@ui/pages/claims/claimDetailDocuments.page";
import { ClaimDocumentsRoute } from "@ui/pages/claims/documents/ClaimDocuments.page";
import { ClaimForecastRoute } from "@ui/pages/claims/forecast/ClaimForecast.page";
import {
  ClaimLineItemsRoute,
  ReviewClaimLineItemsRoute,
} from "@ui/pages/claims/claimLineItems/ViewClaimLineItems.page";
import { EditClaimLineItemsRoute } from "@ui/pages/claims/claimLineItems/EditClaimLineItems.page";
import { ClaimsDashboardRoute } from "@ui/pages/claims/claimDashboard.page";
import { ClaimSummaryRoute } from "@ui/pages/claims/claimSummary.page";
import { DeveloperHomePage } from "@ui/pages/developer/home.page";
import { DeveloperPageCrasherPage } from "@ui/pages/developer/PageCrasher.page";
import { DeveloperPageCrasherForbiddenPage } from "@ui/pages/developer/PageCrasherForbidden.page";
import { DeveloperUserSwitcherPage } from "@ui/pages/developer/UserSwitcher.page";
import { ForecastDashboardRoute } from "@ui/pages/forecasts/forecastDashboard.page";
import { LoansSummaryRoute } from "@ui/pages/loans/loanOverview.page";
import { LoansRequestRoute } from "@ui/pages/loans/loanRequest.page";
import { UpdateForecastRoute } from "@ui/pages/forecasts/UpdateForecastTile.page";
import { ViewForecastRoute } from "@ui/pages/forecasts/ViewForecastTile.page";
import { MonitoringReportCreateRoute } from "@ui/pages/monitoringReports/create/monitoringReportCreate.page";
import { MonitoringReportDeleteRoute } from "@ui/pages/monitoringReports/monitoringReportDelete.page";
import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportPreparePeriodRoute } from "@ui/pages/monitoringReports/monitoringReportPeriodStep.page";
import { MonitoringReportWorkflowRoute } from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { PCRSpendProfileOverheadDocumentRoute } from "@ui/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { PCRSpendProfileReviewCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummaryReview.page";
import { PCRSpendProfileDeleteCostRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileDeleteCost.page";
import {
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { ProjectChangeRequestAddTypeRoute } from "@ui/pages/pcrs/addType";
import { PCRCreateRoute } from "@ui/pages/pcrs/create";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PartnerLevelReallocateCostsDetailsRoute } from "@ui/pages/pcrs/reallocateCosts/CostCategoryLevelReallocateCostsDetails.page";
import { PartnerLevelReallocateCostsRoute } from "@ui/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.page";
import { ChangeRemainingGrantRoute } from "@ui/pages/pcrs/reallocateCosts/edit/partner/changeRemainingGrant.page";
import { PCRDetailsRoute } from "@ui/pages/pcrs/overview/projectChangeRequestDetails.page";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRPrepareItemRoute, PCRReviewItemRoute, PCRViewItemRoute } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import {
  PCRPrepareReasoningRoute,
  PCRReviewReasoningRoute,
  PCRViewReasoningRoute,
} from "@ui/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { PCRReviewRoute } from "@ui/pages/pcrs/pcrReview";
import { ProjectDashboardRoute } from "@ui/pages/projects/dashboard/Dashboard.page";
import { ProjectDetailsRoute } from "@ui/pages/projects/details/ProjectDetails.page";
import { ProjectDocumentsRoute } from "@ui/pages/projects/documents/projectDocuments.page";
import { FailedBankCheckConfirmationRoute } from "@ui/pages/projects/failedBankCheckConfirmation.page";
import { FinanceSummaryRoute } from "@ui/pages/projects/finance-summary/financeSummary.page";
import { PartnerDetailsRoute } from "@ui/pages/projects/partnerDetails/partnerDetails.page";
import { PartnerDetailsEditRoute } from "@ui/pages/projects/partnerDetails/partnerDetailsEdit.page";
import { ProjectOverviewRoute } from "@ui/pages/projects/projectOverview/projectOverview.page";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import { ProjectSetupBankDetailsRoute } from "@ui/pages/projects/setup/projectSetupBankDetails.page";
import { ProjectSetupBankDetailsVerifyRoute } from "@ui/pages/projects/setup/projectSetupBankDetailsVerify.page";
import { ProjectSetupBankStatementRoute } from "@ui/pages/projects/setup/projectSetupBankStatement.page";
import { ProjectSetupPartnerPostcodeRoute } from "@ui/pages/projects/setup/projectSetupPartnerPostcode.page";
import { ProjectSetupSpendProfileRoute } from "@ui/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.page";
import { ClaimsDetailsRoute } from "@ui/pages/claims/claimDetails.page";
import { PrepareClaimRoute } from "@ui/pages/claims/claimPrepare.page";
import { ReviewClaimRoute } from "@ui/pages/claims/claimReview/claimReview.page";
import { PCRDeleteRoute } from "@ui/pages/pcrs/pcrDelete.page";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { ContactSetupAssociateRoute } from "@ui/pages/contact/associate/setup/ContactSetupAssociate.page";
import { ManageTeamMembersDashboardRoute } from "@ui/containers/pages/projects/details/manageTeamMembers/dashboard/ManageTeamMembersDashboard";

export type IRoutes = typeof routeConfig;
export type RouteKeys = keyof IRoutes;

export const routeConfig = {
  allClaimsDashboard: AllClaimsDashboardRoute,
  BroadcastPage: BroadcastPageRoute,
  claimsDashboard: ClaimsDashboardRoute,
  claimDetails: ClaimsDetailsRoute,
  claimDetailDocuments: ClaimDetailDocumentsRoute,
  claimDocuments: ClaimDocumentsRoute,
  claimForecast: ClaimForecastRoute,
  claimLineItems: ClaimLineItemsRoute,
  claimSummary: ClaimSummaryRoute,
  financeSummary: FinanceSummaryRoute,
  failedBankCheckConfirmation: FailedBankCheckConfirmationRoute,
  home: DeveloperHomePage,
  developerUserSwitcherPage: DeveloperUserSwitcherPage,
  developerPageCrasherPage: DeveloperPageCrasherPage,
  developerPageCrasherForbiddenPage: DeveloperPageCrasherForbiddenPage,
  monitoringReportCreate: MonitoringReportCreateRoute,
  monitoringReportDashboard: MonitoringReportDashboardRoute,
  monitoringReportDelete: MonitoringReportDeleteRoute,
  monitoringReportWorkflow: MonitoringReportWorkflowRoute,
  monitoringReportPreparePeriod: MonitoringReportPreparePeriodRoute,
  partnerDetails: PartnerDetailsRoute,
  partnerDetailsEdit: PartnerDetailsEditRoute,
  prepareClaim: PrepareClaimRoute,
  prepareClaimLineItems: EditClaimLineItemsRoute,
  loansSummary: LoansSummaryRoute,
  loansRequest: LoansRequestRoute,
  projectChangeRequestAddType: ProjectChangeRequestAddTypeRoute,
  projectChangeRequestSubmittedForReview: ProjectChangeRequestSubmittedForReviewRoute,
  pcrCreate: PCRCreateRoute,
  pcrDetails: PCRDetailsRoute,
  pcrDelete: PCRDeleteRoute,
  pcrReallocateCostsEditPartnerLevel: ChangeRemainingGrantRoute,
  pcrReallocateCostsEditCostCategoryLevel: PartnerLevelReallocateCostsRoute,
  pcrReallocateCostsDetails: PartnerLevelReallocateCostsDetailsRoute,
  pcrPrepare: ProjectChangeRequestPrepareRoute,
  pcrPrepareItem: PCRPrepareItemRoute,
  pcrSpendProfileCostsSummary: PCRSpendProfileCostsSummaryRoute,
  pcrSpendProfileReviewCostsSummary: PCRSpendProfileReviewCostsSummaryRoute,
  pcrPrepareSpendProfileAddCost: PCRSpendProfileAddCostRoute,
  pcrPrepareSpendProfileDeleteCost: PCRSpendProfileDeleteCostRoute,
  pcrPrepareSpendProfileEditCost: PCRSpendProfileEditCostRoute,
  pcrSpendProfileOverheadDocument: PCRSpendProfileOverheadDocumentRoute,
  pcrPrepareReasoning: PCRPrepareReasoningRoute,
  pcrReview: PCRReviewRoute,
  pcrReviewItem: PCRReviewItemRoute,
  pcrReviewReasoning: PCRReviewReasoningRoute,
  pcrViewItem: PCRViewItemRoute,
  pcrViewReasoning: PCRViewReasoningRoute,
  pcrsDashboard: PCRsDashboardRoute,
  contactSetupAssociate: ContactSetupAssociateRoute,
  projectDashboard: ProjectDashboardRoute,
  projectDetails: ProjectDetailsRoute,
  projectDocuments: ProjectDocumentsRoute,
  projectOverview: ProjectOverviewRoute,
  projectSetup: ProjectSetupRoute,
  projectSetupSpendProfile: ProjectSetupSpendProfileRoute,
  projectSetupBankDetails: ProjectSetupBankDetailsRoute,
  projectSetupPostcode: ProjectSetupPartnerPostcodeRoute,
  projectSetupBankStatement: ProjectSetupBankStatementRoute,
  projectSetupBankDetailsVerify: ProjectSetupBankDetailsVerifyRoute,
  projectManageTeamMembersDashboard: ManageTeamMembersDashboardRoute,
  reviewClaim: ReviewClaimRoute,
  reviewClaimLineItems: ReviewClaimLineItemsRoute,
  forecastDashboard: ForecastDashboardRoute,
  viewForecast: ViewForecastRoute,
  forecastUpdate: UpdateForecastRoute,
} as const;

export const getRoutes = () => Object.entries(routeConfig);
