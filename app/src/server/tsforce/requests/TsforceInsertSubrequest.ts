import { TsforceSalesforceResponse } from "../types/TsforceSalesforceResponse";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSobjectSubrequest } from "./BaseTsforceSubrequest";

class TsforceInsertSubrequest<T> extends BaseTsforceSobjectSubrequest<TsforceSalesforceResponse> {
  method = "POST" as const;
  private readonly body: T;

  constructor({ sobject, body, connection }: { sobject: string; body: T } & BaseTsforceRequestProps) {
    super({ sobject, connection });
    this.body = body;
  }

  payload() {
    return { body: this.body as AnyObject, queryParameters: undefined, url: `/sobjects/${this.sobject}/` };
  }
}

export { TsforceInsertSubrequest };
