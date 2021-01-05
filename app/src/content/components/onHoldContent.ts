import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class OnHoldContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "onHoldContent", competitionType);
  }

  public readonly projectOnHoldMessage = this.getContent("components.onHoldContent.projectOnHoldMessage");
  public readonly partnerOnHoldMessage = this.getContent("components.onHoldContent.partnerOnHoldMessage");
}
