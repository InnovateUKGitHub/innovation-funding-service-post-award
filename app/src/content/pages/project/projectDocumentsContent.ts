import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { DocumentLabels } from "../../labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ProjectDocumentsContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "project-documents", competitionType);
  }

  public readonly noMatchingDocumentsMessage = this.getContent("noMatchingDocumentsMessage");
  public readonly searchDocumentsMessage = this.getContent("searchDocumentsMessage");
  public readonly documentsUploadedMessage = this.getContent("documentsUploadedMessage");
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
