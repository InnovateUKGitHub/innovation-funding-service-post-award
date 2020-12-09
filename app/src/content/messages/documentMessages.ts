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

  public readonly formTitle = this.getContent("form-title");
  public readonly uploadDocumentsLabel = this.getContent("upload-documents");
  public readonly documentsTitle = this.getContent("documents-title");
  public readonly claimDocumentsTitle = this.getContent("claim-documents-title");
  public readonly uploadInstruction = this.getContent("uploadInstruction", { markdown: true });

  public readonly backLink = (costCategoryName: string) => this.getContent("back-link", {costCategoryName});

  public uploadMessages(totalFiles: number) {
    const contentKey = (totalFiles === 1) ? "uploaded-document" : "uploaded-documents";
    return this.getContent(contentKey, {totalFiles});
  }
}
