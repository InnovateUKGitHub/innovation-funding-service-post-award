import SalesforceBase from "./salesforceBase";
import {Stream} from "stream";

export interface ISalesforceContentVersion {
  Id: string;
  Title: string;
  FileExtension: string;
  ContentDocumentId: string;
  ContentSize: number;
  FileType: string;
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]>;
  getDocument(id: string): Promise<ISalesforceContentVersion>;
  getDocumentData(id: string): Promise<Stream>;
}

const fieldNames: (keyof ISalesforceContentVersion)[] = [ "Id", "Title", "FileExtension", "ContentDocumentId", "ContentSize", "FileType" ];

export class ContentVersionRepository extends SalesforceBase<ISalesforceContentVersion> implements IContentVersionRepository {

  constructor() {
    super("ContentVersion", fieldNames);
  }

  public getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]> {
    return super.whereString(`ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`);
  }

  public getDocument(id: string): Promise<ISalesforceContentVersion> {
    return super.retrieve(id).then(x => {
      if (x === null) {
        throw Error("Document not found");
      }
      return x;
    });
  }

  public getDocumentData(id: string): Promise<Stream> {
    return super.getBlob(id, "VersionData");
  }
}
