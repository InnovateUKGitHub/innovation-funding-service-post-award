import SalesforceBase from "./salesforceBase";

export interface ISalesforceContentVersion {
  ContentDocumentId: string;
  LinkedEntityId: string;
  CreatedDate: string;
  Title: string;
  FileExtension: string;
}

export interface IContentContentVersionRepository {
  getDocuments(ContentDocumentIds: string[]): Promise<ISalesforceContentVersion[]>;
}

export class ContentVersionRepository extends SalesforceBase<ISalesforceContentVersion> implements IContentContentVersionRepository {

  constructor() {
    super("ContentVersion", [ "ContentDocumentId", "PathOnClient", "CreatedDate", "Title", "FileExtension" ]);
  }

  public getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]> {
    return super.whereString(`ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`);
  }
}
