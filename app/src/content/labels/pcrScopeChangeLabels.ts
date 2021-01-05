import { ContentBase } from "@content/contentBase";

export class PCRScopeChangeLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "pcr-scope-change-labels", competitionType);
  }

  public readonly existingDescription = this.getContent("existing-description");
  public readonly newDescription = this.getContent("new-description");
  public readonly existingSummary = this.getContent("existing-summary");
  public readonly newSummary = this.getContent("new-summary");
}
