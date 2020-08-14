import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "@content/messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { ProjectDto } from "@framework/dtos";

export class ProjectDetailsContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-details", project);
  }

  public readonly projectMessages = new ProjectMessages(this, this.project);
  public readonly projectLabels = new ProjectLabels(this, this.project);
  public readonly contactLabels = new ProjectContactLabels(this, this.project);
}
