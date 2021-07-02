import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRRemovePartnerLabels } from "@content/labels/pcrRemovePartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRRemovePartnerSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-remove-partner-summary", competitionType);
  }

  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
  public readonly labels = new PCRRemovePartnerLabels(this, this.competitionType);
}
