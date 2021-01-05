import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class ClaimLastModifiedContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "claimLastModified", competitionType);
  }

  public readonly message = this.getContent("components.claimLastModified.message");
}
