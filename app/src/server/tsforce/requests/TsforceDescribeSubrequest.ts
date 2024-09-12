import { BaseTsforceSobjectSubrequest } from "./BaseTsforceSubrequest";

interface TsforceDescribeSobjectFieldPicklistEntry {
  active: boolean;
  defaultValue: boolean;
  label?: string | null;
  value: string;
}

interface TsforceDescribeSObjectField {
  name: string;
  picklistValues: TsforceDescribeSobjectFieldPicklistEntry[];
}

interface TsforceDescribeSObjectResult {
  fields: TsforceDescribeSObjectField[];
}

class TsforceDescribeSubrequest extends BaseTsforceSobjectSubrequest<TsforceDescribeSObjectResult> {
  method = "GET" as const;

  payload() {
    return { body: undefined, queryParameters: undefined, url: `/sobjects/${this.sobject}/describe` };
  }
}

export {
  TsforceDescribeSubrequest,
  TsforceDescribeSobjectFieldPicklistEntry,
  TsforceDescribeSObjectResult,
  TsforceDescribeSObjectField,
};
