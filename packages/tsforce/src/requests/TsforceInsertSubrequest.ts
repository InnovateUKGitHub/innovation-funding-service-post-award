import { TsforceSalesforceResponse } from "../types/TsforceSalesforceResponse";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSobjectSubrequest } from "./BaseTsforceSubrequest";
import { AnyObject } from "../types/AnyObject";

class TsforceInsertSubrequest<T> extends BaseTsforceSobjectSubrequest<TsforceSalesforceResponse> {
  method = "POST" as const;
  private readonly body: T;

  constructor({ sobject, body, connection }: { sobject: string; body: T } & BaseTsforceRequestProps) {
    super({ sobject, connection });
    this.body = body;
  }

  payload() {
    return {
      body: this.body as AnyObject,
      queryParameters: undefined,
      url: `/services/data/v${this.version}/sobjects/${this.sobject}/`,
    };
  }
}

export { TsforceInsertSubrequest };
