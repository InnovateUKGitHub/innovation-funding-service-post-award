import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRReasoningLabels } from "@content/labels/pcrReasoningLabels";

export class PCRReasoningSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-reasoning-summary", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRReasoningLabels(this, this.competitionType);
  public readonly markAsCompleteHeading = this.getContent("heading-mark-as-complete");
  public readonly edit = this.getContent("edit");
  public readonly noDocuments = this.getContent("no-documents");
}
