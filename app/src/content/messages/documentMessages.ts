import { ContentBase } from "../contentBase";
import { ProjectDto } from "@framework/dtos";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "document-messages", project);
  }

  public readonly header = this.getContent("header", { markdown: true });
  public readonly infoTitle = this.getContent("infoTitle");
  public readonly infoContent = this.getContent("infoContent", { markdown: true });
  public readonly noDocumentsUploaded = this.getContent("no-documents-uploaded");
  public readonly documentsNotApplicable = this.getContent("documents-not-applicable");
  public readonly newWindow = this.getContent("new-window");

  public uploadMessages(totalFiles: number) {
    const contentKey = (totalFiles === 1) ? "uploaded-document" : "uploaded-documents";
    return this.getContent(contentKey, {totalFiles});
  }
}
