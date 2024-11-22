import { BaseTsforceSobjectIdSubrequest } from "./BaseTsforceSubrequest";

class TsforceDeleteSubrequest extends BaseTsforceSobjectIdSubrequest<null> {
  method = "DELETE" as const;

  payload() {
    return {
      body: undefined,
      queryParameters: undefined,
      url: `/services/data/v${this.version}/sobjects/${this.sobject}/${this.id}`,
    };
  }
}

export { TsforceDeleteSubrequest };
