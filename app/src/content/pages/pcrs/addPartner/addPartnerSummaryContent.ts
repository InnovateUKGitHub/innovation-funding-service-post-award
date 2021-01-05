import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRAddPartnerSummaryContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "pcr-add-partner-summary", competitionType);
  }

  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
