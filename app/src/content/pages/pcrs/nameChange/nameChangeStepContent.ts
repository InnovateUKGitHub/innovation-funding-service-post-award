import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRNameChangeLabels } from "@content/labels/pcrNameChangeLabels";

export class PCRNameChangeContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-name-change", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRNameChangeLabels(this, this.competitionType);

  public readonly selectPartnerHeading = this.getContent("heading-select-partner");
  public readonly enterNameHeading = this.getContent("heading-enter-name");
}
