import { IClientUser } from "./IUser";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

export interface ILinkInfo {
    routeName: string;
    routeParams: any;
    accessControl: (user: IClientUser, config: IClientConfig) => boolean;
}
