import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { DocumentLabels } from "../../labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";
import { ProjectDto } from "@framework/dtos";

export class ProjectDocumentsContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "project-documents", project);
  }

  public readonly noMatchingDocumentsMessage = this.getContent("noMatchingDocumentsMessage");
  public readonly searchDocumentsMessage = this.getContent("searchDocumentsMessage");
  public readonly documentsUploadedMessage = this.getContent("documentsUploadedMessage");
  public readonly documentLabels = new DocumentLabels(this, this.project);
  public readonly documentMessages = new DocumentMessages(this, this.project);
}
