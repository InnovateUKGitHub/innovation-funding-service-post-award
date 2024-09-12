import { DocumentFilter } from "@framework/types/DocumentFilter";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { ReadableStream } from "stream/web";

export interface ISalesforceDocument {
  Id: string;
  Title: string;
  FileExtension: string | null;
  ContentDocumentId: string;
  ContentSize: number;
  FileType: string | null;
  ReasonForChange: string;
  PathOnClient: string;
  ContentLocation: string;
  VersionData: string;
  Description: string | null;
  CreatedDate: string;
  Acc_LastModifiedByAlias__c: string;
  Acc_UploadedByMe__c: boolean;
  Owner: {
    Username: string;
  };
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[], filter: DocumentFilter): Promise<ISalesforceDocument[]>;
  getDocument(id: string): Promise<ISalesforceDocument>;
  getDocumentData(id: string): Promise<ReadableStream<Uint8Array>>;
  insertDocument(file: IFileWrapper, description: string): Promise<string>;
}

const BATCH_LIMIT = 200;

export class ContentVersionRepository
  extends SalesforceRepositoryBase<ISalesforceDocument>
  implements IContentVersionRepository
{
  protected readonly salesforceObjectName = "ContentVersion";

  protected readonly salesforceFieldNames = [
    "Id",
    "Title",
    "FileExtension",
    "ContentDocumentId",
    "ContentSize",
    "FileType",
    "Description",
    "CreatedDate",
    "Acc_LastModifiedByAlias__c",
    "Acc_UploadedByMe__c",
    "Owner.Username",
  ];

  public async getDocuments(contentDocumentIds: string[], filter?: DocumentFilter): Promise<ISalesforceDocument[]> {
    // Collate a list of all Salesforce fetches.
    const promises = [];

    // For each 200 documents...
    for (let i = 0; i < contentDocumentIds.length; i += BATCH_LIMIT) {
      // Make a query for the ContentDocument for all of the documents.
      let queryString = `ContentDocumentId IN ('${contentDocumentIds
        .slice(i, i + BATCH_LIMIT)
        .map(sss)
        .join("', '")}') AND IsLatest = true`;
      if (filter && filter.description) {
        queryString += ` AND Description = '${sss(filter.description)}'`;
      }

      // Add the promise for the 200 documents into the promise list.
      promises.push(super.where(queryString));
    }

    // Get an array of arrays of all ContentDocument.
    const results = await Promise.all(promises);

    // Flatten the array of arrays.
    return results.flat();
  }

  public getDocument(versionId: string): Promise<ISalesforceDocument> {
    return super.retrieve(versionId).then(x => {
      if (x === null || x === undefined) {
        throw Error("Document not found");
      }
      return x;
    });
  }

  public async insertDocument(document: ServerFileWrapper, description?: string | null) {
    return super.insertItem({
      ReasonForChange: "First Upload",
      PathOnClient: document.fileName,
      ContentLocation: "S",
      VersionData: await document.read(),
      Description: description,
    });
  }

  public getDocumentData(versionId: string): Promise<ReadableStream<Uint8Array>> {
    return super.getBlob(versionId);
  }
}
