import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class PCRAddPartnerSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-summary", competitionType);
  }

  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
