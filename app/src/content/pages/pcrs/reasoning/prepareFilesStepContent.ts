import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { DocumentMessages } from "@content/messages/documentMessages";
import { DocumentLabels } from "@content/labels/documentLabels";

export class PCRReasoningPrepareFilesContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-reasoning-prepare-files", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
