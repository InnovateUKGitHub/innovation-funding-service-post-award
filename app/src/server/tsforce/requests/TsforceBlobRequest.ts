import { Readable } from "node:stream";
import { BaseTsforceRequestProps, BaseTsforceSobjectIdRequest } from "./BaseTsforceRequest";

class TsforceBlobRequest extends BaseTsforceSobjectIdRequest<Readable> {
  private readonly fieldName: string;

  constructor({
    fieldName,
    sobject,
    connection,
    id,
  }: { fieldName: string; sobject: string; id: string } & BaseTsforceRequestProps) {
    super({ connection, sobject, id });
    this.fieldName = fieldName;
  }

  execute() {
    return this.connection.httpClient.fetchBlob(`/sobjects/${this.sobject}/${this.id}/${this.fieldName}`, {
      method: "GET",
      headers: {
        Accept: "application/json; charset=UTF-8",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
  }
}

export { TsforceBlobRequest };
