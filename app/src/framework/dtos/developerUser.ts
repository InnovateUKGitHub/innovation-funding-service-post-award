import { SalesforceRole } from "@server/repositories";

export interface DeveloperUser {
  name: string;
  role: SalesforceRole;
  email: string;
  externalUsername: string;
  internalUsername?: string;
}
