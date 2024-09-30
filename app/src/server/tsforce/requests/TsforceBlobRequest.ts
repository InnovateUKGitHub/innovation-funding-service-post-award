import { Writable } from "node:stream";
import { BaseTsforceSobjectIdRequest } from "./BaseTsforceRequest";

class TsforceBlobRequest extends BaseTsforceSobjectIdRequest<Writable> {
  execute() {
    return this.connection.httpClient.fetchBlob(
      `/services/data/${this.version}/sobjects/${this.sobject}/${this.id}/body`,
      {
        chunked: true,
      },
    );
  }
}

export { TsforceBlobRequest };
