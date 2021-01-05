import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRRemovePartnerLabels } from "@content/labels/pcrRemovePartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRRemovePartnerSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-remove-partner-summary", competitionType);
  }

  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
  public readonly labels = new PCRRemovePartnerLabels(this, this.competitionType);
}
