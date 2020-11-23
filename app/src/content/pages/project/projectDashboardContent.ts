import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "../../messages/projectMessages";
import { ProjectDto } from "@framework/dtos";

export class ProjectDashboardContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "projects-dashboard", project);
  }

  public readonly searchTitle = this.getContent("searchTitle");
  public readonly searchHint = this.getContent("searchHint");
  public readonly searchLabel = this.getContent("searchLabel");

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

  public readonly messages = new ProjectMessages(this, this.project);

}
