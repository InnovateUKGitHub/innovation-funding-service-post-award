import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRNameChangeLabels } from "@content/labels/pcrNameChangeLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRNameChangeSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-name-change-summary", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);
  public readonly labels = new PCRNameChangeLabels(this, this.competitionType);
  public readonly documentMessage = new DocumentMessages(this, this.competitionType);
}
