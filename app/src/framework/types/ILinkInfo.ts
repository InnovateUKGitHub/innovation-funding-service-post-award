import { IAccessControlOptions } from "./IAccessControlOptions";
import { IClientUser } from "./IUser";

export interface ILinkInfo {
  path: string;
  routeName: string;
  routeParams: AnyObject;
  accessControl: (user: IClientUser, accessControlOptions: IAccessControlOptions) => boolean;
}
