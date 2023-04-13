import { SalesforceRole } from "@server/repositories";

export interface DeveloperUser {
  externalUsername: string | null;
  internalUsername: string | null;
  name: string;
  role: SalesforceRole;
}
