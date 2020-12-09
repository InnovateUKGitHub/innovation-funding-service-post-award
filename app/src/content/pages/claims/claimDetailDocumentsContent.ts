import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ProjectDto } from "@framework/dtos";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ClaimDetailDocumentsContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "claim-detail-documents", project);
  }
  public readonly messages = new ClaimMessages(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
}
