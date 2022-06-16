import { PermissionGroupIdentifier } from "@framework/constants";

export interface PermissionGroup {
  id: string;
  identifier: PermissionGroupIdentifier;
  name: string;
}
