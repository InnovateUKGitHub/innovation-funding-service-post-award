import { ContentBase, ContentResult } from "./contentBase";
import { HomePageContent } from "./pages/homePageContent";
import { ProjectDashboardContent } from "./pages/projectDashboardContent";
import { ProjectOverviewContent } from "./pages/projectOverviewContent";
import { ProjectDetailsContent } from "./pages/projectDetailsContent";
import { FinanceSummaryContent } from "./pages/financeSummaryContent";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  constructor() {
    super(null, null);
  }

  readonly home = new HomePageContent(this);
  public projectsDashboard = new ProjectDashboardContent(this);
  public projectOverview = new ProjectOverviewContent(this);
  public projectDetails = new ProjectDetailsContent(this);
  public financeSummary = new FinanceSummaryContent(this);

}
