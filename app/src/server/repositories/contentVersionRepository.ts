import SalesforceBase from "./salesforceBase";

export interface ISalesforceContentVersion {
  ContentDocumentId: string;
  LinkedEntityId: string;
  Title: string;
  FileExtension: string;
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]>;
}

const fieldNames: (keyof ISalesforceContentVersion)[] = [ "ContentDocumentId", "LinkedEntityId", "Title", "FileExtension" ];

export class ContentVersionRepository extends SalesforceBase<ISalesforceContentVersion> implements IContentVersionRepository {

  constructor() {
    super("ContentVersion", fieldNames);
  }

  public getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]> {
    return super.whereString(`ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`);
  }
}
