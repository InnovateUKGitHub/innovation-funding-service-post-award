import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";

export class PCRTimeExtensionStepContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "pcr-time-extension-step", competitionType);
  }

  public readonly existingProjectHeading = this.getContent("existing-project-heading");
  public readonly dateLabel = this.getContent("date-label");
  public readonly durationLabel = this.getContent("duration-label");
  public readonly proposedProjectHeading = this.getContent("proposed-project-heading");
  public readonly timeExtensionHint = this.getContent("time-extension-hint");
  public readonly saveAndContinue = this.getContent("save-and-continue");
}
