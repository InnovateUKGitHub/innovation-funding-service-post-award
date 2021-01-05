import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "../../messages/projectMessages";

export class ProjectDashboardContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "projects-dashboard", competitionType);
  }

  public readonly searchTitle = this.getContent("searchTitle");
  public readonly searchHint = this.getContent("searchHint");
  public readonly searchLabel = this.getContent("searchLabel");
  public readonly backToDashboard = this.getContent("backToDashboard");
  public readonly backToHomepage = this.getContent("backToHomepage");

  public readonly projectCountPrefixMessage = (projectCount: number) => {
    const hasSingleProject = projectCount === 1;

    return hasSingleProject
      ? this.getContent("project-prefix-count.singular", { projectCount })
      : this.getContent("project-prefix-count.plural", { projectCount });
  };

  public readonly pendingMessage = (projectCount: number) =>
    this.getContent("countMessages.pendingMessage", { projectCount });
  public readonly liveMessage = (projectCount: number) =>
    this.getContent("countMessages.liveMessage", { projectCount });
  public readonly upcomingMessage = (projectCount: number) =>
    this.getContent("countMessages.upcomingMessage", { projectCount });
  public readonly archivedMessage = (projectCount: number) =>
    this.getContent("countMessages.archivedMessage", { projectCount });

  public readonly live = {
    noProjects: this.getContent("noLiveProjectsMessage"),
    noMatchingProjects: this.getContent("noLiveMatchingMessage"),
  };

  public readonly upcoming = {
    noProjects: this.getContent("noUpcomingProjectsMessage"),
    noMatchingProjects: this.getContent("noUpcomingMatchingMessage"),
  };

  public readonly archived = {
    noProjects: this.getContent("noArchivedProjectsMessage"),
    noMatchingProjects: this.getContent("noArchivedMatchingMessage"),
  };

  public readonly messages = new ProjectMessages(this, this.competitionType);
}
