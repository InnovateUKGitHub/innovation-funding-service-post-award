import { BaseTsforceSobjectIdRequest } from "./BaseTsforceRequest";

class TsforceBlobRequest extends BaseTsforceSobjectIdRequest<ReadableStream<Uint8Array> | null> {
  execute() {
    return this.connection.httpClient.fetchBlob(
      `/services/data/${this.version}/sobjects/${this.sobject}/${this.id}/body`,
    );
  }
}

export { TsforceBlobRequest };
