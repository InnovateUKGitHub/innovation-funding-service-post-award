import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { ProjectDto } from "@framework/dtos";
import { PCRItem } from "../pcrItem";
import { DocumentMessages } from "@content/messages/documentMessages";
import { DocumentLabels } from "@content/labels/documentLabels";

export class PCRPrepareItemFilesForPartnerWithrawelContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "pcr-prepare-item-files-for-partner-withdrawel", project);
  }

  public readonly pcrItem = new PCRItem(this, this.project);
  public readonly documentLabels = new DocumentLabels(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);

  public readonly guidanceHeading = () => this.getContent("guidance-heading");
  public readonly guidance = () => this.getContent("guidance", {markdown: true});
}
