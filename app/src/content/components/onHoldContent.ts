import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class OnHoldContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "onHoldContent", competitionType);
  }

  public readonly projectOnHoldMessage = this.getContent("components.onHoldContent.projectOnHoldMessage");
  public readonly partnerOnHoldMessage = this.getContent("components.onHoldContent.partnerOnHoldMessage");
}
