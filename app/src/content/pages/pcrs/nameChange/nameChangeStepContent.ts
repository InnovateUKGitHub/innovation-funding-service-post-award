import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRNameChangeLabels } from "@content/labels/pcrNameChangeLabels";
import { PCRItem } from "../pcrItem";

export class PCRNameChangeContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-name-change", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRNameChangeLabels(this, this.competitionType);

  public readonly selectPartnerHeading = this.getContent("heading-select-partner");
  public readonly enterNameHeading = this.getContent("heading-enter-name");
}
