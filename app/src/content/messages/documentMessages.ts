import { ContentBase } from "@content/contentBase";
import { DocumentSummaryDto } from "@framework/dtos";
import { IAppOptions } from "@framework/types/IAppOptions";

export class DocumentMessages extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "document-messages", competitionType);
  }

  public readonly header = (maxFileSize: IAppOptions["maxFileSize"]) => {
    return this.getContent("header", { markdown: true, maxFileSize });
  };
  public readonly infoTitle = this.getContent("infoTitle");
  public readonly infoContent = (permittedTypes: IAppOptions["permittedTypes"]) => {
    return this.getContent("infoContent", { markdown: true, ...permittedTypes });
  };
  public readonly noDocumentsUploaded = this.getContent("no-documents-uploaded");
  public readonly documentsNotApplicable = this.getContent("documents-not-applicable");
  public readonly newWindow = this.getContent("new-window");

  public readonly uploadTitle = this.getContent("upload-title");
  public readonly uploadDocumentsLabel = this.getContent("upload-documents");
  public readonly documentsTitle = this.getContent("documents-title");
  public readonly claimDocumentsTitle = this.getContent("claim-documents-title");
  public readonly uploadInstruction1 = this.getContent("upload-instruction-1");
  public readonly uploadInstruction2 = this.getContent("upload-instruction-2");

  public readonly documentsIntroMessage = {
    storingDocumentsMessage: this.getContent("documentsIntroMessage.storing-documents-message"),
    notForClaimsMessage: this.getContent("documentsIntroMessage.not-for-claims-message"),
  };

  public readonly backLink = (previousPage: string) => this.getContent("back-link", { previousPage });

  public documentDeleted = (documentToDelete: DocumentSummaryDto) =>
    this.getContent("deleted-document", { deletedFileName: documentToDelete.fileName });

  public getDocumentUploadedMessage(totalFiles: number) {
    const contentKey = totalFiles === 1 ? "uploaded-document" : "uploaded-documents";
    return this.getContent(contentKey, { totalFiles });
  }
}
