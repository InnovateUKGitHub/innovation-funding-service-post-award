import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRRemovePartnerLabels } from "@content/labels/pcrRemovePartnerLabels";

export class PCRRemovePartnerContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-remove-partner", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRRemovePartnerLabels(this, this.competitionType);

  public readonly selectPartnerHeading = this.getContent("heading-select-partner");
  public readonly removalPeriodHeading = this.getContent("heading-removal-period");
  public readonly removalPeriodHint = this.getContent("hint-removal-period");
}
