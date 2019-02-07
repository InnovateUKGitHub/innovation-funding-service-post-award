import { Stream } from "stream";
import { FileUpload } from "../../types/FileUpload";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceContentVersion {
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
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[], filter: DocumentFilter): Promise<ISalesforceContentVersion[]>;
  getDocument(id: string): Promise<ISalesforceContentVersion>;
  getDocumentData(id: string): Promise<Stream>;
  insertDocument(file: FileUpload): Promise<string>;
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
    "Description"
  ];

  public getDocuments(contentDocumentIds: string[], filter?: DocumentFilter): Promise<ISalesforceContentVersion[]> {
    let queryString = `ContentDocumentId IN ('${contentDocumentIds.join("', '")}') AND IsLatest = true`;
    if (filter && filter.description) {
      queryString += ` AND Description = '${filter.description}'`;
    }
    return super.where(queryString);
  }

  public getDocument(id: string): Promise<ISalesforceContentVersion> {
    return super.retrieve(id).then(x => {
      if (x === null) {
        throw Error("Document not found");
      }
      return x;
    });
  }

  public insertDocument({ content, fileName, description }: FileUpload) {
    return super.insert({
      ReasonForChange: "First Upload",
      PathOnClient: fileName,
      ContentLocation: "S",
      VersionData: content,
      Description: description
    });
  }

  public getDocumentData(id: string): Promise<Stream> {
    return super.getBlob(id, "VersionData");
  }
}
