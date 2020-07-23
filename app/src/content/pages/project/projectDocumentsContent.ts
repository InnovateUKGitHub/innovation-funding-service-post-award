import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { DocumentLabels } from "../../labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ProjectDocumentsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-documents");
  }

  public readonly uploadTitle = () => this.getContent("uploadTitle");
  public readonly uploadInstruction = () => this.getContent("uploadInstruction", { markdown: true });
  public readonly noDocumentsMessage = () => this.getContent("noDocumentsMessage");
  public readonly noMatchingDocumentsMessage = () => this.getContent("noMatchingDocumentsMessage");
  public readonly documentLabels = new DocumentLabels(this);
  public readonly documentMessages = new DocumentMessages(this);
}
