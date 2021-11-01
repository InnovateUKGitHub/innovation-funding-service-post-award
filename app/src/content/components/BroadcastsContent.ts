import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class BroadcastContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "broadcastContent");
  }

  public readonly broadcastsTitle = this.getContent("components.broadcastContent.broadcastsTitle");

  public readonly broadcastCaption = this.getContent("components.broadcastContent.broadcastCaption");

  public readonly loadingBroadcasts = this.getContent("components.broadcastContent.loadingBroadcasts");

  public readonly errorBroadcasts = this.getContent("components.broadcastContent.errorBroadcasts");

  public readonly emptyBroadcasts = this.getContent("components.broadcastContent.emptyBroadcasts");

  public readonly broadcastDetailsHeading = this.getContent("components.broadcastContent.broadcastDetailsHeading");
  public readonly broadcastMessageHeading = this.getContent("components.broadcastContent.broadcastMessageHeading");

  public readonly readBroadcastLinkText = this.getContent("components.broadcastContent.readBroadcastLinkText");
  public readonly broadcastLabelStartDate = this.getContent("components.broadcastContent.broadcastLabelStartDate");
  public readonly broadcastLabelEndDate = this.getContent("components.broadcastContent.broadcastLabelEndDate");
}
