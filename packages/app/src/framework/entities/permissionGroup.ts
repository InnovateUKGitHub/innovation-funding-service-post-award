import { PermissionGroupIdentifier } from "@framework/constants/enums";

export interface PermissionGroup {
  id: string;
  identifier: PermissionGroupIdentifier;
  name: string;
}
