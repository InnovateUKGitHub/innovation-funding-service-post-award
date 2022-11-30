import { SalesforceConnection } from "@gql/sf/SalesforceConnection";

declare global {
  namespace Express {
    export interface Request {
      sf?: SalesforceConnection;
    }
  }
}
