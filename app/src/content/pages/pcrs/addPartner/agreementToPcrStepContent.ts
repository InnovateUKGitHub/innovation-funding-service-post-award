import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRAddPartnerAgreementToPCRContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "pcr-add-partner-agreement-to-pcr", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);

  public readonly guidance = this.getContent("guidance");
  public readonly heading = this.getContent("heading");
}
