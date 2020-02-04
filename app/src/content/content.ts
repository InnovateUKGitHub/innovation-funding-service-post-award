import { ContentBase, ContentResult } from "./contentBase";
import { HomePageContent } from "./pages/homePageContent";
import { ProjectDashboardContent } from "./pages/projectDashboardContent";

export type ContentSelector = (content: Content) => ContentResult;

export class Content extends ContentBase {
  constructor() {
    super(null, null);
  }

  readonly home = new HomePageContent(this);
  public projectsDashboard = new ProjectDashboardContent(this);

}
