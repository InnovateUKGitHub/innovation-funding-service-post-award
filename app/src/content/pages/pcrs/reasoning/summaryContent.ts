import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRReasoningLabels } from "@content/labels/pcrReasoningLabels";
import { PCRItem } from "../pcrItem";

export class PCRReasoningSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-reasoning-summary", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRReasoningLabels(this, this.competitionType);
  public readonly markAsCompleteHeading = this.getContent("heading-mark-as-complete");
  public readonly edit = this.getContent("edit");
  public readonly noDocuments = this.getContent("no-documents");
}
