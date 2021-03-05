import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";

export class PCRAddPartnerJeSContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "pcr-add-partner-jes", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRAddPartnerLabels(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);

  public readonly jesWebsiteLinkAlt = this.getContent("jes-website-link-alt");
  public readonly jesWebsiteLinkContent = this.getContent("jes-website-link-content");

  public readonly jesIntroduction = this.getContent("jes-introduction");
  public readonly jesUploadSupport = this.getContent("jes-upload-support");

  public readonly jesListItem1LinkAlt = this.getContent("jes-list-item-1-link-alt");
  public readonly jesListItem1LinkContent = this.getContent("jes-list-item-1-link-content");
  public readonly jesListItem2 = this.getContent("jes-list-item-2-before-link");
}
