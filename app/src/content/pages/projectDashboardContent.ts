import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "../messages/projectMessages";

export class ProjectDashboardContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "projects-dashboard");
  }

  public searchTitle = () => this.getContent("searchTitle");
  public searchHint = () => this.getContent("searchHint");
  public searchLabel = () => this.getContent("searchLabel");

  public live = {
    noProjects: () => this.getContent("noLiveProjectsMessage"),
    noMatchingProjects: () => this.getContent("noLiveMatchingMessage"),
  };

  public upcoming = {
    title: () => this.getContent("upcomingTitle"),
    noProjects: () => this.getContent("noUpcomingProjectsMessage"),
    noMatchingProjects: () => this.getContent("noUpcomingMatchingMessage"),
  };

  public archived = {
    title: () => this.getContent("archivedTitle"),
    noProjects: () => this.getContent("noArchivedProjectsMessage"),
    noMatchingProjects: () => this.getContent("noArchivedMatchingMessage"),
  };

  public messages = new ProjectMessages(this);

}
