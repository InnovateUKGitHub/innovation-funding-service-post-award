import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRReasoningPrepareReasoningContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-reasoning-prepare-reasoning", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly hint = this.getContent("hint", { markdown: true });
  public readonly reasoningHeading = this.getContent("heading-reasoning");
}
