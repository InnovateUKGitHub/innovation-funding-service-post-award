import { IRoleInfo } from "../server/features/projects/getAllProjectRolesForUser";

export interface IUser {
  email: string;
  name: string;
  roleInfo: {[key: string]: IRoleInfo};
}
