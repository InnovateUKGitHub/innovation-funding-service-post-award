import { ContentBase } from "@content/contentBase";

export class PCRRemovePartnerLabels extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "pcr-remove-partner-labels", competitionType);
  }

  public readonly removalPeriod = this.getContent("removal-period");
  public readonly removedPartner = this.getContent("removed-partner");
  public readonly lastPeriod = this.getContent("last-period");
  public readonly documents = this.getContent("documents");
}
