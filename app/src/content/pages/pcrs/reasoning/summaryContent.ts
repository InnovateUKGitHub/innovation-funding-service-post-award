import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";
import { PCRReasoningLabels } from "@content/labels/pcrReasoningLabels";

export class PCRReasoningSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-reasoning-summary", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRReasoningLabels(this, this.project);
  public readonly markAsCompleteHeading = this.getContent("heading-mark-as-complete");
  public readonly edit = this.getContent("edit");
  public readonly noDocuments = this.getContent("no-documents");
}
