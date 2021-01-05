import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { DocumentMessages } from "@content/messages/documentMessages";
import { DocumentLabels } from "@content/labels/documentLabels";

export class PCRPrepareItemFilesForPartnerWithrawelContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-prepare-item-files-for-partner-withdrawel", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);

  public readonly guidanceHeading = this.getContent("guidance-heading");
  public readonly guidance = this.getContent("guidance", { markdown: true });
}
