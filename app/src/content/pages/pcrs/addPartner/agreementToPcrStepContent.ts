import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerAgreementToPCRContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-add-partner-agreement-to-pcr", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);

  public readonly guidance = this.getContent("guidance");
  public readonly heading = this.getContent("heading");
}
