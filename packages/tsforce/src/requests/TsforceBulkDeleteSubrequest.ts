import { TsforceSalesforceResponse } from "../types/TsforceSalesforceResponse";
import { BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { BaseTsforceSubrequest } from "./BaseTsforceSubrequest";

class TsforceBulkDeleteSubrequest extends BaseTsforceSubrequest<TsforceSalesforceResponse[]> {
  method = "DELETE" as const;
  protected readonly ids: string[];

  constructor({ ids, connection }: { ids: string[] } & BaseTsforceRequestProps) {
    super({ connection });
    this.ids = ids;
  }

  payload() {
    return { body: undefined, queryParameters: { ids: this.ids.join(",") }, url: "/composite/sobjects" };
  }
}

export { TsforceBulkDeleteSubrequest };
