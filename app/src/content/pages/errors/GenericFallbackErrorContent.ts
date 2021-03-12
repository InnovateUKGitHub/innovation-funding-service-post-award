import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";

export class GenericFallbackErrorContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "generic-fallback-error");
  }

  public readonly standardError = this.getContent("message");
  public readonly dashboardText = this.getContent("dashboardText");
}
