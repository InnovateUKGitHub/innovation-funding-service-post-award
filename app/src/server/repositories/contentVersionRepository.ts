import SalesforceBase from "./salesforceBase";
import {Stream} from "stream";

export interface ISalesforceContentVersion {
  Id: string;
  Title: string;
  FileExtension: string;
  ContentDocumentId: string;
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]>;
}

const fieldNames: (keyof ISalesforceContentVersion)[] = [ "Id", "Title", "FileExtension", "ContentDocumentId" ];

export class ContentVersionRepository extends SalesforceBase<ISalesforceContentVersion> implements IContentVersionRepository {

  constructor() {
    super("ContentVersion", fieldNames);
  }

  public getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]> {
    return super.whereString(`ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`);
  }

  public getDocument(id: string): Promise<Stream> {
    return super.getBlob(id, "VersionData");
  }
}
