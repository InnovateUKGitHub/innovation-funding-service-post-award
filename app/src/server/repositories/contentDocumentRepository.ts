import SalesforceRepositoryBase from "./salesforceRepositoryBase";

interface ISalesforceContentDocument {
  Id: string;
}

export interface IContentDocumentRepository {
  delete(id: string): Promise<void>;
}

export class ContentDocumentRepository extends SalesforceRepositoryBase<ISalesforceContentDocument> implements IContentDocumentRepository {

  protected readonly salesforceObjectName = "ContentDocument";

  protected readonly salesforceFieldNames = [
    "Id",
  ];

  public delete(id: string): Promise<void> {
    return super.deleteItem(id);
  }
}
