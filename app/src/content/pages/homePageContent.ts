import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class HomePageContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "home", competitionType);
  }

  public readonly exampleContentTitle = this.getContent("example.contentTitle");
  public readonly exampleContent = this.getContent("example.content");
  public readonly currentUserHeading = this.getContent("current-user-heading");
  public readonly changeUserMessage = this.getContent("change-user-message");
  public readonly resetUserMessage = this.getContent("reset-user-message");
  public readonly projectsHeading = this.getContent("projects-heading");
  public readonly projectsDashboardHeading = this.getContent("projects-dashboard-heading");
}
