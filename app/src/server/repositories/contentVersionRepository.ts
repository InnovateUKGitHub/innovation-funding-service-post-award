import { Stream } from "stream";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { DocumentFilter } from "@framework/types/DocumentFilter";
import { IFileWrapper } from "@framework/types";

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
  Owner: {
    Username: string
  };
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[], filter: DocumentFilter): Promise<ISalesforceDocument[]>;
  getDocument(id: string): Promise<ISalesforceDocument>;
  getDocumentData(id: string): Promise<Stream>;
  insertDocument(file: IFileWrapper, description: string): Promise<string>;
}

export class ContentVersionRepository extends SalesforceRepositoryBase<ISalesforceDocument> implements IContentVersionRepository {

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
    "Owner.Username"
  ];

  public getDocuments(contentDocumentIds: string[], filter?: DocumentFilter): Promise<ISalesforceDocument[]> {
    let queryString = `ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`;
    if (filter && filter.description) {
      queryString += ` AND Description = '${filter.description}'`;
    }
    return super.where(queryString);
  }

  public getDocument(versionId: string): Promise<ISalesforceDocument> {
    return super.retrieve(versionId).then(x => {
      if (x === null) {
        throw Error("Document not found");
      }
      return x;
    });
  }

  public insertDocument(document: ServerFileWrapper, description?: string | null) {
    return super.insertItem({
      ReasonForChange: "First Upload",
      PathOnClient: document.fileName,
      ContentLocation: "S",
      VersionData: document.read(),
      Description: description
    });
  }

  public getDocumentData(versionId: string): Promise<Stream> {
    return super.getBlob(versionId, "VersionData");
  }
}
