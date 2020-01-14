import { Stream } from "stream";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { ServerFileWrapper } from "@server/apis/controllerBase";

interface ISalesforceContentVersion {
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
  Description?: string;
  CreatedDate: string;
  Acc_LastModifiedByAlias__c: string;
  Owner: {
    Username: string
  };
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[], filter: DocumentFilter): Promise<ISalesforceContentVersion[]>;
  getDocument(id: string): Promise<ISalesforceContentVersion>;
  getDocumentData(id: string): Promise<Stream>;
  insertDocument(file: IFileWrapper, description: string): Promise<string>;
}

export class ContentVersionRepository extends SalesforceRepositoryBase<ISalesforceContentVersion> implements IContentVersionRepository {

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

  public getDocuments(contentDocumentIds: string[], filter?: DocumentFilter): Promise<ISalesforceContentVersion[]> {
    let queryString = `ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`;
    if (filter && filter.description) {
      queryString += ` AND Description = '${filter.description}'`;
    }
    return super.where(queryString);
  }

  public getDocument(versionId: string): Promise<ISalesforceContentVersion> {
    return super.retrieve(versionId).then(x => {
      if (x === null) {
        throw Error("Document not found");
      }
      return x;
    });
  }

  public insertDocument(document: ServerFileWrapper, description?: string) {
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
