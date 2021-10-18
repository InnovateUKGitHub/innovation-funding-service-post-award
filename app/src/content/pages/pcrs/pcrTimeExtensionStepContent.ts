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
  public readonly changeProjectDurationHint = this.getContent("change-project-duration-hint");
  public readonly changeProjectDurationHint2 = this.getContent("change-project-duration-hint-2");
  public readonly changeProjectDurationHint3 = this.getContent("change-project-duration-hint-3");
  public readonly loadingTimeExtensionOptions = this.getContent("loading-time-extension-options");
  public readonly saveAndContinue = this.getContent("save-and-continue");
  public readonly currentProjectEndDate = this.getContent("current-project-end-date");
}
