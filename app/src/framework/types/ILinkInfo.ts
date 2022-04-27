import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { IClientUser } from "./IUser";

export interface ILinkInfo {
  path: string;
  routeName: string;
  routeParams: any;
  accessControl: (user: IClientUser, config: IClientConfig) => boolean;
}
