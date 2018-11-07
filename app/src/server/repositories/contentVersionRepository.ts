import SalesforceBase from "./salesforceBase";
import { Stream } from "stream";
import {Connection} from "jsforce";

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
}

export interface IContentVersionRepository {
  getDocuments(contentDocumentIds: string[]): Promise<ISalesforceContentVersion[]>;
  getDocument(id: string): Promise<ISalesforceContentVersion>;
  getDocumentData(id: string): Promise<Stream>;
  insertDocument(file: FileUpload): Promise<string>;
}

const fieldNames: (keyof ISalesforceContentVersion)[] = ["Id", "Title", "FileExtension", "ContentDocumentId", "ContentSize", "FileType"];

export class ContentVersionRepository extends SalesforceBase<ISalesforceContentVersion> implements IContentVersionRepository {

  constructor(connection: () => Promise<Connection>) {
    super(connection, "ContentVersion", fieldNames);
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

  public insertDocument({content, fileName}: FileUpload) {
    return super.insert({
      ReasonForChange: "First Upload",
      PathOnClient: fileName,
      ContentLocation: "S",
      VersionData: content,
    });
  }

  public getDocumentData(id: string): Promise<Stream> {
    return super.getBlob(id, "VersionData");
  }
}
