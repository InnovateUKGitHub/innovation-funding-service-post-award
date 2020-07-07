import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRAddPartnerSummaryContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-summary");
  }

  public readonly labels = new PCRAddPartnerLabels(this);
  public readonly documentMessages = new DocumentMessages(this);
}
