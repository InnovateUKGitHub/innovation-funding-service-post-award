import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class PhaseBannerContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "phaseBannerContent", project);
  }

  public readonly newServiceMessage = this.getContent("components.phaseBannerContent.newServiceMessage");
  public readonly feedbackMessage = this.getContent("components.phaseBannerContent.feedbackMessage");
  public readonly helpImprove = this.getContent("components.phaseBannerContent.helpImprove");
  public readonly betaText = this.getContent("components.phaseBannerContent.betaText");
}
