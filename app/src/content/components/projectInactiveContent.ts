import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ProjectInactiveContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "projectInactiveContent");
  }

  public readonly projectOnHoldMessage = this.getContent("components.projectInactiveContent.projectOnHoldMessage");
  public readonly projectTerminatedMessage = this.getContent("components.projectInactiveContent.projectTerminatedMessage");
  public readonly projectClosedMessage = this.getContent("components.projectInactiveContent.projectClosedMessage");
  public readonly projectInactiveMessage = this.getContent("components.projectInactiveContent.projectInactiveMessage");
  public readonly partnerOnHoldMessage = this.getContent("components.projectInactiveContent.partnerOnHoldMessage");
}
