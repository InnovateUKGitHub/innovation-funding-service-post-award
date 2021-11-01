import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class BroadcastPage extends ContentPageBase {
  constructor(content: Content) {
    super(content, "broadcast-page");
  }

  public readonly broadcastTitle = this.getContent("components.broadcastContent.broadcastTitle");
  public readonly loadingBroadcast = this.getContent("components.broadcastContent.loadingBroadcast");
  public readonly errorBroadcast = this.getContent("components.broadcastContent.errorBroadcast");
  public readonly emptyBroadcast = this.getContent("components.broadcastContent.emptyBroadcast");
}
