import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class PostcodeContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "partner-details-edit");
  }

  public readonly postcodeSectionTitle = this.getContent("section-title-postcode");
  public readonly currentPostcodeLabel = this.getContent("label-current-postcode");
  public readonly newPostcodeLabel = this.getContent("label-new-postcode");
  public readonly newPostcodeHint = this.getContent("hint-new-postcode");
}
