import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRNameChangeLabels } from "@content/labels/pcrNameChangeLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { PCRItem } from "../pcrItem";

export class PCRNameChangeSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-name-change-summary", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRNameChangeLabels(this, this.competitionType);
  public readonly documentMessage = new DocumentMessages(this, this.competitionType);
}
