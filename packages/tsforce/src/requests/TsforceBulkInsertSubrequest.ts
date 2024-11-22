import { TsforceSalesforceResponse } from "../types/TsforceSalesforceResponse";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSobjectSubrequest } from "./BaseTsforceSubrequest";
import { AnyObject } from "../types/AnyObject";

class TsforceBulkInsertSubrequest<T> extends BaseTsforceSobjectSubrequest<TsforceSalesforceResponse[]> {
  method = "POST" as const;
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
      url: `/services/data/v${this.version}/composite/sobjects`,
    };
  }
}

export { TsforceBulkInsertSubrequest };
