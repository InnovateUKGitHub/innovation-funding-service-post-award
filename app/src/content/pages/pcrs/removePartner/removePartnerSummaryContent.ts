import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRRemovePartnerLabels } from "@content/labels/pcrRemovePartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRRemovePartnerSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-remove-partner-summary", project);
  }

  public readonly documentMessages = new DocumentMessages(this, this.project);
  public readonly labels = new PCRRemovePartnerLabels(this, this.project);
}
