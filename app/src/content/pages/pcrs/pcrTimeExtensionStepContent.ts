import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ProjectDto } from "@framework/dtos";

export class PCRTimeExtensionStepContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-time-extension-step", project);
  }

  public readonly existingProjectHeading = this.getContent("existing-project-heading");
  public readonly dateLabel = this.getContent("date-label");
  public readonly durationLabel = this.getContent("duration-label");
  public readonly proposedProjectHeading = this.getContent("proposed-project-heading");
  public readonly timeExtensionHint = this.getContent("time-extension-hint");
  public readonly saveAndContinue = this.getContent("save-and-continue");

}
