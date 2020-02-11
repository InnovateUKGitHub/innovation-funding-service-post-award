import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { DocumentLabels } from "../labels/documentLabels";
import { DocumentMessages } from "@content/messages/documentMessages";

export class ProjectDocumentsContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "project-documents");
  }

  public uploadTitle = () => this.getContent("uploadTitle");
  public uploadInstruction = () => this.getContent("uploadInstruction", { markdown: true });
  public noDocumentsMessage = () => this.getContent("noDocumentsMessage");
  public noMatchingDocumentsMessage = () => this.getContent("noMatchingDocumentsMessage");
  public documentLabels = new DocumentLabels(this);
  public documentMessages = new DocumentMessages(this);
}
