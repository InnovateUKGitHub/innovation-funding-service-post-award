import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class PCRAddPartnerSummaryContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-summary", project);
  }

  public readonly labels = new PCRAddPartnerLabels(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
}
