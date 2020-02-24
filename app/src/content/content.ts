import { ContentBase, ContentResult } from "./contentBase";
import { HomePageContent } from "./pages/homePageContent";
import { ProjectDashboardContent } from "./pages/projectDashboardContent";
import { ProjectOverviewContent } from "./pages/projectOverviewContent";
import { ProjectDetailsContent } from "./pages/projectDetailsContent";
import { FinanceSummaryContent } from "./pages/financeSummaryContent";
import { ProjectDocumentsContent } from "./pages/projectDocumentsContent";
import { NotFoundContent, UnexpectedErrorContent } from "./pages/errorsContent";
import { AllClaimsDashboardContent } from "@content/pages/claims/allClaimsDashboardContent";
import { ClaimsDashboardContent } from "@content/pages/claims/claimsDashboardContent";
import { ClaimDocumentsContent } from "@content/pages/claims/claimDocumentsContent";
import { ClaimDetailsContent } from "@content/pages/claims/claimDetailsContent";
import { ClaimPrepareContent } from "@content/pages/claims/claimPrepareContent";
import { FinancialVirementSummaryContent } from "./pages/financialVirementSummaryContent";
import { FinancialVirementEditContent } from "./pages/financialVirementEditContent";
import { FinancialVirementDetailsContent } from "./pages/financialVirementDetailsContent";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  constructor() {
    super(null, null);
  }

  public readonly home = new HomePageContent(this);

  public readonly projectsDashboard = new ProjectDashboardContent(this);
  public readonly projectOverview = new ProjectOverviewContent(this);
  public readonly projectDetails = new ProjectDetailsContent(this);
  public readonly projectDocuments = new ProjectDocumentsContent(this);

  public readonly financeSummary = new FinanceSummaryContent(this);

  public readonly allClaimsDashboard = new AllClaimsDashboardContent(this);
  public readonly claimsDashboard = new ClaimsDashboardContent(this);
  public readonly claimDocuments = new ClaimDocumentsContent(this);
  public readonly claimDetails = new ClaimDetailsContent(this);
  public readonly claimPrepare = new ClaimPrepareContent(this);

  public readonly financialVirementSummary = new FinancialVirementSummaryContent(this);
  public readonly financialVirementEdit = new FinancialVirementEditContent(this);
  public readonly financialVirementDetails = new FinancialVirementDetailsContent(this);

  public readonly errors = {
    notfound: new NotFoundContent(this),
    unexpected: new UnexpectedErrorContent(this)
  };
}
