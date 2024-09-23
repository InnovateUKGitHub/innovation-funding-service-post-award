import { TsforceSalesforceResponse } from "../types/TsforceSalesforceResponse";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSobjectSubrequest } from "./BaseTsforceSubrequest";

class TsforceBulkUpdateSubrequest<T> extends BaseTsforceSobjectSubrequest<TsforceSalesforceResponse[]> {
  method = "PATCH" as const;
  protected readonly body: T[];

  constructor({ body, sobject, connection }: { body: T[]; sobject: string } & BaseTsforceRequestProps) {
    super({ connection, sobject });
    this.body = body;
  }

  payload() {
    return {
      body: {
        records: this.body.map(x => ({ ...x, attributes: { type: this.sobject } })) as AnyObject[],
      },
      queryParameters: undefined,
      url: `/composite/sobjects`,
    };
  }
}

export { TsforceBulkUpdateSubrequest };
