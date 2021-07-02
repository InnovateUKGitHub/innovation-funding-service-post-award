import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimLastModifiedContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claimLastModified", competitionType);
  }

  public readonly message = this.getContent("components.claimLastModified.message");
}
