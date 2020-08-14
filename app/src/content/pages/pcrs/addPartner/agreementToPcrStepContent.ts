import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRAddPartnerAgreementToPCRContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "pcr-add-partner-agreement-to-pcr");
  }

  public readonly pcrItem = new PCRItem(this);
  public readonly labels = new PCRAddPartnerLabels(this);
  public readonly documentLabels = new DocumentLabels(this);
  public readonly documentMessages = new DocumentMessages(this);

  public readonly guidance = () => this.getContent("guidance");
  public readonly heading = () => this.getContent("heading");
}
