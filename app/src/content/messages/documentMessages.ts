import { ContentBase } from "../contentBase";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "document-messages", competitionType);
  }

  public readonly header = this.getContent("header", { markdown: true });
  public readonly infoTitle = this.getContent("infoTitle");
  public readonly infoContent = this.getContent("infoContent", { markdown: true });
  public readonly noDocumentsUploaded = this.getContent("no-documents-uploaded");
  public readonly documentsNotApplicable = this.getContent("documents-not-applicable");
  public readonly newWindow = this.getContent("new-window");

  public readonly uploadTitle = this.getContent("upload-title");
  public readonly uploadDocumentsLabel = this.getContent("upload-documents");
  public readonly documentsTitle = this.getContent("documents-title");
  public readonly claimDocumentsTitle = this.getContent("claim-documents-title");
  public readonly uploadInstruction = this.getContent("upload-instruction");

  public readonly documentsIntroMessage = {
    storingDocumentsMessage: this.getContent("documentsIntroMessage.storing-documents-message"),
    notForClaimsMessage: this.getContent("documentsIntroMessage.not-for-claims-message"),
  };

  public readonly backLink = (previousPage: string) => this.getContent("back-link", { previousPage });

  public getDocumentUploadedMessage(totalFiles: number) {
    const contentKey = totalFiles === 1 ? "uploaded-document" : "uploaded-documents";
    return this.getContent(contentKey, { totalFiles });
  }
}
