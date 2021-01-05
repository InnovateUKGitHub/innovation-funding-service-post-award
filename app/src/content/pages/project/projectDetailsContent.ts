import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "../../content";
import { ProjectMessages } from "@content/messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";

export class ProjectDetailsContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "project-details", competitionType);
  }

  public readonly projectMessages = new ProjectMessages(this, this.competitionType);
  public readonly projectLabels = new ProjectLabels(this, this.competitionType);
  public readonly contactLabels = new ProjectContactLabels(this, this.competitionType);
}
