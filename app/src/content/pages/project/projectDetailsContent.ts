import { ContentPageBase } from "@content/contentPageBase";
import { ProjectMessages } from "@content/messages/projectMessages";
import { ProjectLabels } from "@content/labels/projectLabels";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { Content } from "@content/content";

export class ProjectDetailsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "project-details", competitionType);
  }

  public readonly projectManagerInfo = this.getContent("project-manager-info");
  public readonly financeContactInfo = this.getContent("finance-contact-info");
  public readonly changeInfo = this.getContent("change-info");
  public readonly changeEmail = this.getContent("change-email");
  public readonly changeEnd = this.getContent("change-end");

  public readonly projectMessages = new ProjectMessages(this, this.competitionType);
  public readonly projectLabels = new ProjectLabels(this, this.competitionType);
  public readonly contactLabels = new ProjectContactLabels(this, this.competitionType);
}
