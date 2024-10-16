import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentFilter } from "@framework/types/DocumentFilter";
import { mapToDocumentSummaryDto } from "./mapToDocumentSummaryDto";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { IContext } from "@framework/types/IContext";
import { dateComparator } from "@framework/util/comparator";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export abstract class DocumentsSummaryQueryBase extends AuthorisedAsyncQueryBase<DocumentSummaryDto[]> {
  public logger: ILogger = new Logger("DocumentsSummaryQueryBase");

  constructor(protected readonly filter?: DocumentFilter) {
    super();
  }

  protected abstract getRecordId(context: IContext): Promise<string | null>;

  protected abstract getUrl(document: DocumentEntity): string;

  protected async run(context: IContext): Promise<DocumentSummaryDto[]> {
    const recordId = await this.getRecordId(context);
    this.logger.debug("Obtaining documents", recordId);

    if (!recordId) return [];

    const linkedDocs = await context.repositories.documents.getDocumentsMetadataByLinkedRecord(recordId, this.filter);

    if (!linkedDocs.length) return [];

    return linkedDocs
      .map(x => mapToDocumentSummaryDto(x, this.getUrl(x)))
      .sort((a, b) => dateComparator(a.dateCreated, b.dateCreated) * -1);
  }
}
