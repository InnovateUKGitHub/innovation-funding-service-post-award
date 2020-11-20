import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRItem } from "../pcrItem";
import { PCRAddPartnerLabels } from "@content/labels/pcrAddPartnerLabels";
import { ProjectDto } from "@framework/dtos";
import { DocumentLabels } from "@content/labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class PCRAddPartnerJeSContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-add-partner-jes", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly labels = new PCRAddPartnerLabels(this, this.project);
  public readonly documentLabels = new DocumentLabels(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);

  public readonly guidance = this.getContent("guidance", {markdown: true});
}
