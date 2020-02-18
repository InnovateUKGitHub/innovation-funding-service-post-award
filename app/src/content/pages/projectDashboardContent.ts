import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectMessages } from "../messages/projectMessages";

export class ProjectDashboardContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "projects-dashboard");
  }

  public readonly searchTitle = () => this.getContent("searchTitle");
  public readonly searchHint = () => this.getContent("searchHint");
  public readonly searchLabel = () => this.getContent("searchLabel");

  public readonly live = {
    noProjects: () => this.getContent("noLiveProjectsMessage"),
    noMatchingProjects: () => this.getContent("noLiveMatchingMessage"),
  };

  public readonly upcoming = {
    title: () => this.getContent("upcomingTitle"),
    noProjects: () => this.getContent("noUpcomingProjectsMessage"),
    noMatchingProjects: () => this.getContent("noUpcomingMatchingMessage"),
  };

  public readonly archived = {
    title: () => this.getContent("archivedTitle"),
    noProjects: () => this.getContent("noArchivedProjectsMessage"),
    noMatchingProjects: () => this.getContent("noArchivedMatchingMessage"),
  };

  public readonly messages = new ProjectMessages(this);

}
