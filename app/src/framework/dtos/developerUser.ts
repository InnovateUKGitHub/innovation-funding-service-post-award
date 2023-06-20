import { SalesforceRole } from "@server/repositories/projectContactsRepository";

export interface DeveloperUser {
  externalUsername: string | null;
  internalUsername: string | null;
  name: string;
  role: SalesforceRole;
}
