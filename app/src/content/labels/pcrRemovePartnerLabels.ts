import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class PCRRemovePartnerLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "pcr-remove-partner-labels", project);
  }

  public readonly removalPeriod = this.getContent("removal-period");
  public readonly removedPartner = this.getContent("removed-partner");
  public readonly lastPeriod = this.getContent("last-period");
  public readonly documents = this.getContent("documents");
}
