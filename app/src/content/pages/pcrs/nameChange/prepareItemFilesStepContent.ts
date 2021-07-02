import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { PCRItem } from "../pcrItem";

export class PCRNameChangePrepareItemFilesContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-name-change-prepare-item-files", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);

  public readonly uploadCertificateHeading = this.getContent("heading-upload-certificate");
}
