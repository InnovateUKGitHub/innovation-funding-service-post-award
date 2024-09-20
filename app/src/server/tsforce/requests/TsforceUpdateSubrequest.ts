import { TsforceUnsuccessfulSalesforceResponse } from "../types/TsforceSalesforceResponse";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSobjectIdSubrequest } from "./BaseTsforceSubrequest";

class TsforceUpdateSubrequest extends BaseTsforceSobjectIdSubrequest<null | TsforceUnsuccessfulSalesforceResponse> {
  method = "PATCH" as const;
  private readonly body: AnyObject;

  constructor({
    sobject,
    id,
    body,
    connection,
  }: { sobject: string; id: string; body: AnyObject } & BaseTsforceRequestProps) {
    super({ sobject, id, connection });
    this.body = body;
  }

  payload() {
    return { body: this.body, queryParameters: undefined, url: `/sobjects/${this.sobject}/${this.id}` };
  }
}

export { TsforceUpdateSubrequest };
