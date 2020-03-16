import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";

export interface ISessionUser {
  email: string;
}

export interface IClientUser {
  email: string;
  roleInfo: {[projectId: string]: IRoleInfo};
  csrf: string;
}
