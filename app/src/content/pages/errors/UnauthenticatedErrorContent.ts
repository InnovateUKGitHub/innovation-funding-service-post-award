import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";

export class UnauthenticatedErrorContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "unauthenticated-error");
  }

  public readonly contactUsPreLinkContent = this.getContent("preLinkContent");
  public readonly contactUsLinkTextContent = this.getContent("linkTextContent");
  public readonly contactUsPostLinkContent = this.getContent("postLinkContent");
}
