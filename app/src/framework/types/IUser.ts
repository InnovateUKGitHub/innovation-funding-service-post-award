import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";

export interface ISessionUser {
  email: string;

  /**
   * Only available within a development SSO-disabled environment.
   * Set to the last-selected project of the User Switcher.
   */
  projectId?: string;
}

export interface IClientUser extends ISessionUser {
  roleInfo: { [projectId: string]: IRoleInfo };
  csrf: string;
}
