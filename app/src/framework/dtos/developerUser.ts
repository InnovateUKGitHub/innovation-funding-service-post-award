import { SalesforceRole } from "@server/repositories";

export interface DeveloperUser {
  email: string;
  externalUsername?: string;
  internalUsername?: string;
  name: string;
  role: SalesforceRole;
}
