import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class PhaseBannerContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "phaseBannerContent", competitionType);
  }

  public readonly newServiceMessage = this.getContent("components.phaseBannerContent.newServiceMessage");
  public readonly feedbackMessage = this.getContent("components.phaseBannerContent.feedbackMessage");
  public readonly helpImprove = this.getContent("components.phaseBannerContent.helpImprove");
  public readonly betaText = this.getContent("components.phaseBannerContent.betaText");
}
