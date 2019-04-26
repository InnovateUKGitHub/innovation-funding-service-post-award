import { DateTime } from "luxon";
import { ISalesforceDocument } from "@server/repositories";

export const mapToDocumentSummaryDto = (doc: ISalesforceDocument) => ({
  link: `/api/documents/${doc.Id}/content`,
  fileName: doc.FileExtension ? `${doc.Title}.${doc.FileExtension}` : doc.Title,
  id: doc.ContentDocumentId,
  description: doc.Description,
  fileSize: doc.ContentSize,
  dateCreated: DateTime.fromISO(doc.CreatedDate).toJSDate(),
  owner: doc.Owner && doc.Owner.Username
});
