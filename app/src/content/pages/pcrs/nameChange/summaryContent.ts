import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";
import { PCRNameChangeLabels } from "@content/labels/pcrNameChangeLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRNameChangeSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-name-change-summary", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRNameChangeLabels(this, this.project);
  public readonly documentMessage = new DocumentMessages(this, this.project);
}
