import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";

export class PCRReasoningPrepareReasoningContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-reasoning-prepare-reasoning", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly hint = this.getContent("hint", { markdown: true });
  public readonly reasoningHeading = this.getContent("heading-reasoning");
}
