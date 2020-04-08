import { IContext } from "@framework/types";
import { QueryBase } from "../common";
import { DocumentDto } from "@framework/dtos/documentDto";

export abstract class DocumentQueryBase extends QueryBase<DocumentDto | null> {
  protected constructor(protected readonly documentId: string) {
    super();
  }

  public async Run(context: IContext) {
    const id = await this.getRecordId(context);

    if(!id) return null;

    const metaData = await context.repositories.documents.getDocumentMetadataForEntityDocument(id, this.documentId);
    if(!metaData) return null;

    const documentStream = await context.repositories.documents.getDocumentContent(this.documentId);
    if(!documentStream) return null;

    return {
      fileType: metaData.fileType,
      contentLength: metaData.contentSize,
      stream: documentStream,
      fileName: metaData.fileExtension ? `${metaData.title}.${metaData.fileExtension}` : metaData.title
    };
  }

  protected abstract getRecordId(context: IContext): Promise<string|null>;
}
