import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { DocumentMessages } from "@content/messages/documentMessages";
import { DocumentLabels } from "../../labels/documentLabels";

export class ProjectDocumentsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "project-documents", competitionType);
  }

  public readonly projectLevelSubtitle = this.getContent("project-level-subtitle");
  public readonly partnerLevelSubtitle = this.getContent("partner-level-subtitle");
  public readonly partnerSelfLevelSubtitle = (partnerName?: string) =>
    this.getContent("partner-self-level-subtitle", { partnerName });
  public readonly noMatchingDocumentsMessage = this.getContent("noMatchingDocumentsMessage");
  public readonly searchDocumentsMessage = this.getContent("searchDocumentsMessage");
  public readonly documentsUploadedMessage = this.getContent("documentsUploadedMessage");
  public readonly documentLabels = new DocumentLabels(this, this.competitionType);
  public readonly documentMessages = new DocumentMessages(this, this.competitionType);
}
