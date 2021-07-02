import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class PCRTimeExtensionStepContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-time-extension-step", competitionType);
  }

  public readonly existingProjectHeading = this.getContent("existing-project-heading");
  public readonly dateLabel = this.getContent("date-label");
  public readonly durationLabel = this.getContent("duration-label");
  public readonly proposedProjectHeading = this.getContent("proposed-project-heading");
  public readonly timeExtensionHint = this.getContent("time-extension-hint");
  public readonly saveAndContinue = this.getContent("save-and-continue");
}
