import { ContentBase, ContentResult } from "./contentBase";
import { HomePageContent } from "./pages/homePageContent";
import { ProjectDashboardContent } from "./pages/project/projectDashboardContent";
import { ProjectOverviewContent } from "./pages/project/projectOverviewContent";
import { ProjectDetailsContent } from "./pages/project/projectDetailsContent";
import { ProjectSetupContent } from "@content/pages/project/projectSetupContent";
import { ProjectSetupSpendProfileContent } from "./pages/project/projectSetupSpendProfileContent";
import { FinanceSummaryContent } from "./pages/financeSummaryContent";
import { ProjectDocumentsContent } from "./pages/project/projectDocumentsContent";
import { NotFoundContent, UnexpectedErrorContent } from "./pages/errorsContent";
import { AllClaimsDashboardContent } from "@content/pages/claims/allClaimsDashboardContent";
import { ClaimsDashboardContent } from "@content/pages/claims/claimsDashboardContent";
import { ClaimDocumentsContent } from "@content/pages/claims/claimDocumentsContent";
import { ClaimDetailsContent } from "@content/pages/claims/claimDetailsContent";
import { ClaimPrepareContent } from "@content/pages/claims/claimPrepareContent";
import { ClaimPrepareSummaryContent } from "@content/pages/claims/claimPrepareSummaryContent";
import { ClaimReviewContent } from "@content/pages/claims/claimReviewContent";
import { FinancialVirementSummaryContent } from "./pages/financialVirementSummaryContent";
import { FinancialVirementEditContent } from "./pages/financialVirementEditContent";
import { FinancialVirementEditPartnerLevelContent } from "./pages/financialVirementEditPartnerLevelContent";
import { FinancialVirementDetailsContent } from "./pages/financialVirementDetailsContent";
import { MonitoringReportsDashboardContent } from "./pages/monitoringReports/monitoringReportsDashboardContent";
import { MonitoringReportsCreateContent } from "./pages/monitoringReports/monitoringReportsCreateContent";
import { MonitoringReportsDeleteContent } from "./pages/monitoringReports/monitoringReportsDeleteContent";
import { MonitoringReportsSummaryContent } from "./pages/monitoringReports/monitoringReportsSummaryContent";
import { MonitoringReportsWorkflowContent } from "./pages/monitoringReports/monitoringReportsWorkflowContent";
import { MonitoringReportsPeriodStepContent } from "./pages/monitoringReports/monitoringReportsPeriodStepContent";
import { MonitoringReportsQuestionStepContent } from "./pages/monitoringReports/monitoringReportsQuestionStep";
import { PartnerDetailsContent } from "./pages/partners/partnerDetailsContent";
import { PartnerDetailsEditContent } from "./pages/partners/partnerDetailsEditContent";
import { PCRCreateContent } from "./pages/pcrs/pcrCreateContent";
import { PCRAddPartnerRoleAndOrganisationContent } from "./pages/pcrs/addPartner/roleAndOrganisationStepContent";
import { DocumentsContent } from "@content/components/documentsContent";
import { PcrSpendProfileCostsSummaryContent } from "@content/pages/pcrSpendProfiles/spendProfileCostsSummaryContent";
import { PcrSpendProfilePrepareCostContent } from "@content/pages/pcrSpendProfiles/spendProfilePrepareCostContent";
import { PcrSpendProfileDeleteCostContent } from "./pages/pcrSpendProfiles/spendProfileDeleteCostContent";
import { PCRPeriodLengthChangeContent } from "@content/pages/pcrs/periodLengthChangeContent";
import { TaskListContent } from "@content/components/taskListContent";
import { PCRAddPartnerAwardRateContent } from "@content/pages/pcrs/addPartner/awardRateStepContent";
import { PCRAddPartnerOtherFundingContent } from "@content/pages/pcrs/addPartner/otherFundingStepContent";
import { PcrSpendProfileOverheadDocumentContent } from "./pages/pcrSpendProfiles/overheadDocumentContainerContent";
import { ClaimForecastContent } from "./pages/claims/claimForecastContent";
import { PCRAddPartnerAcademicCostsContent } from "@content/pages/pcrs/addPartner/academicCostsStepContent";
import { PCRAddPartnerStateAidEligibilityContent } from "@content/pages/pcrs/addPartner/stateAidEligibilityStepContent";
import { PCRAddPartnerSummaryContent } from "./pages/pcrs/addPartner/addPartnerSummaryContent";
import { PCRAddPartnerOtherFundingSourcesContent } from "@content/pages/pcrs/addPartner/otherFundingSourcesContent";
import { ProjectSetupBankDetailsContent } from "@content/pages/project/projectSetupBankDetailsContent";
import { FailedBankCheckConfirmationContent } from "./pages/project/failedBankCheckConfirmationContent";
import { ProjectSetupBankDetailsVerifyContent } from "@content/pages/project/projectSetupBankDetailsVerifyContent";
import { ProjectSetupBankStatementContent } from "@content/pages/project/projectSetupBankStatementContent";
import { PCRAddPartnerProjectLocationContent } from "./pages/pcrs/addPartner/projectLocationStepContent";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  constructor() {
    super(null, null);
  }

  public readonly home = new HomePageContent(this);

  public readonly projectsDashboard = new ProjectDashboardContent(this);
  public readonly projectSetup = new ProjectSetupContent(this);
  public readonly projectOverview = new ProjectOverviewContent(this);
  public readonly projectDetails = new ProjectDetailsContent(this);
  public readonly projectDocuments = new ProjectDocumentsContent(this);
  public readonly projectSetupSpendProfile = new ProjectSetupSpendProfileContent(this);
  public readonly failedBankCheckConfirmation = new FailedBankCheckConfirmationContent(this);
  public readonly projectSetupBankDetails = new ProjectSetupBankDetailsContent(this);
  public readonly projectSetupBankStatement = new ProjectSetupBankStatementContent(this);
  public readonly projectSetupBankDetailsVerify = new ProjectSetupBankDetailsVerifyContent(this);

  public readonly financeSummary = new FinanceSummaryContent(this);

  public readonly allClaimsDashboard = new AllClaimsDashboardContent(this);
  public readonly claimsDashboard = new ClaimsDashboardContent(this);
  public readonly claimDocuments = new ClaimDocumentsContent(this);
  public readonly claimDetails = new ClaimDetailsContent(this);
  public readonly claimForecast = new ClaimForecastContent(this);
  public readonly claimPrepare = new ClaimPrepareContent(this);
  public readonly claimPrepareSummary = new ClaimPrepareSummaryContent(this);
  public readonly claimReview = new ClaimReviewContent(this);

  public readonly financialVirementSummary = new FinancialVirementSummaryContent(this);
  public readonly financialVirementEdit = new FinancialVirementEditContent(this);
  public readonly financialVirementEditPartnerLevel = new FinancialVirementEditPartnerLevelContent(this);
  public readonly financialVirementDetails = new FinancialVirementDetailsContent(this);

  public readonly monitoringReportsDashboard = new MonitoringReportsDashboardContent(this);
  public readonly monitoringReportsCreate = new MonitoringReportsCreateContent(this);
  public readonly monitoringReportsDelete = new MonitoringReportsDeleteContent(this);
  public readonly monitoringReportsSummary = new MonitoringReportsSummaryContent(this);
  public readonly monitoringReportsWorkflow = new MonitoringReportsWorkflowContent(this);
  public readonly monitoringReportsPeriodStep = new MonitoringReportsPeriodStepContent(this);
  public readonly monitoringReportsQuestionStep = new MonitoringReportsQuestionStepContent(this);

  public readonly partnerDetails = new PartnerDetailsContent(this);
  public readonly partnerDetailsEdit = new PartnerDetailsEditContent(this);

  public readonly pcrCreate = new PCRCreateContent(this);

  public readonly pcrPeriodLengthChangeContent = new PCRPeriodLengthChangeContent(this);
  public readonly pcrAddPartnerRoleAndOrganisation = new PCRAddPartnerRoleAndOrganisationContent(this);
  public readonly pcrAddPartnerStateAidEligibilityContent = new PCRAddPartnerStateAidEligibilityContent(this);
  public readonly pcrAddPartnerProjectLocationContent = new PCRAddPartnerProjectLocationContent(this);
  public readonly pcrAddPartnerOtherFunding = new PCRAddPartnerOtherFundingContent(this);
  public readonly pcrAddPartnerAwardRate = new PCRAddPartnerAwardRateContent(this);
  public readonly pcrAddPartnerOtherFundingSources = new PCRAddPartnerOtherFundingSourcesContent(this);
  public readonly pcrAddPartnerAcademicCosts = new PCRAddPartnerAcademicCostsContent(this);
  public readonly pcrAddPartnerSummary = new PCRAddPartnerSummaryContent(this);
  public readonly pcrSpendProfileCostsSummaryContent = new PcrSpendProfileCostsSummaryContent(this);
  public readonly pcrSpendProfilePrepareCostContent = new PcrSpendProfilePrepareCostContent(this);
  public readonly pcrSpendProfileDeleteCostContent = new PcrSpendProfileDeleteCostContent(this);
  public readonly pcrSpendProfileOverheadDocumentContent = new PcrSpendProfileOverheadDocumentContent(this);

  public readonly errors = {
    notfound: new NotFoundContent(this),
    unexpected: new UnexpectedErrorContent(this)
  };

  public readonly components = {
    documents: new DocumentsContent(this),
    taskList: new TaskListContent(this),
  };
}
