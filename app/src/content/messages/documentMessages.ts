import { ContentBase } from "../contentBase";
import { ProjectDto } from "@framework/dtos";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "document-messages", project);
  }

  public readonly header = () => this.getContent("header", { markdown: true });
  public readonly infoTitle = () => this.getContent("infoTitle");
  public readonly infoContent = () => this.getContent("infoContent", { markdown: true });
  public readonly documentUploaded = () => this.getContent("uploaded-document");
  public readonly documentsUploaded = (filesLength: number) => this.getContent("uploaded-documents", {filesLength});
  public readonly noDocumentsUploaded = () => this.getContent("no-documents-uploaded");
  public readonly documentUploadedSuccess = () => this.getContent("document-uploaded-success");
  public readonly documentsUploadedSuccess = (documentsNumber: number) => this.getContent("documents-uploaded-success", {documentsNumber});
  public readonly documentsNotApplicable = () => this.getContent("documents-not-applicable");
}
