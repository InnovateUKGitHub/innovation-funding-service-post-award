import { DateTime } from "luxon";
import { ISalesforceDocument } from "@server/repositories";

export const mapToDocumentSummaryDto = (doc: ISalesforceDocument, link: string): DocumentSummaryDto => ({
  link,
  fileName: doc.FileExtension ? `${doc.Title}.${doc.FileExtension}` : doc.Title,
  id: doc.ContentDocumentId,
  description: doc.Description,
  fileSize: doc.ContentSize,
  dateCreated: DateTime.fromISO(doc.CreatedDate).toJSDate(),
  uploadedBy: doc.Acc_LastModifiedByAlias__c
});
