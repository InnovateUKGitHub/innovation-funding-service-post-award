import { ContentBase, ContentResult } from "./contentBase";
import { HomePageContent } from "./pages/homePageContent";
import { ProjectDashboardContent } from "./pages/projectDashboardContent";
import { ProjectOverviewContent } from "./pages/projectOverviewContent";
import { ProjectDetailsContent } from "./pages/projectDetailsContent";
import { FinanceSummaryContent } from "./pages/financeSummaryContent";
import { ProjectDocumentsContent } from "./pages/projectDocumentsContent";

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

}
