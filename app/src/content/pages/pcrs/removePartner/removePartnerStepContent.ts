import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";
import { PCRRemovePartnerLabels } from "@content/labels/pcrRemovePartnerLabels";

export class PCRRemovePartnerContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-remove-partner", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRRemovePartnerLabels(this, this.project);

  public readonly selectPartnerHeading = () => this.getContent("heading-select-partner");
  public readonly removalPeriodHeading = () => this.getContent("heading-removal-period");
  public readonly removalPeriodHint = () => this.getContent("hint-removal-period");
}
