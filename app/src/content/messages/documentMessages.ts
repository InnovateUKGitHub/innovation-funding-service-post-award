import { ContentBase } from "../contentBase";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "document-messages");
  }

  public readonly header = () => this.getContent("header", { markdown: true });
  public readonly infoTitle = () => this.getContent("infoTitle");
  public readonly infoContent = () => this.getContent("infoContent", { markdown: true });
  public readonly documentUploaded = () => this.getContent("uploaded-claim-document");
  public readonly documentsUploaded = (filesLength: number) => this.getContent("uploaded-claim-documents", {filesLength});
  public readonly noDocumentsUploaded = () => this.getContent("no-documents-uploaded");
  public readonly documentUploadedSuccess = () => this.getContent("document-uploaded-success");
  public readonly documentsUploadedSuccess = (documentsNumber: number) => this.getContent("documents-uploaded-success", {documentsNumber});
}
