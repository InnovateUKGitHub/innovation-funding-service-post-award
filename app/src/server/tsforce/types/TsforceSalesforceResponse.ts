import { TsforceSalesforceError } from "./TsforceSalesforceError";

type TsforceSalesforceResponse = TsforceSuccessfulSalesforceResponse | TsforceUnsuccessfulSalesforceResponse;

interface TsforceSuccessfulSalesforceResponse {
  success: true;
  id: string;
  body: AnyObject;
  queryParameters: AnyObject;
  url: string;
}
interface TsforceUnsuccessfulSalesforceResponse {
  success: false;
  errors: TsforceSalesforceError[];
}

export { TsforceSalesforceResponse };
