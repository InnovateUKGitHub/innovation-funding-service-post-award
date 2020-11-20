import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class PCRScopeChangeLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "pcr-scope-change-labels", project);
  }

  public readonly existingDescription = this.getContent("existing-description");
  public readonly newDescription = this.getContent("new-description");
  public readonly existingSummary = this.getContent("existing-summary");
  public readonly newSummary = this.getContent("new-summary");
}
