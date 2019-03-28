import { IClientUser } from "./IUser";

export interface ILinkInfo {
    routeName: string;
    routeParams: any;
    accessControl: (user: IClientUser) => boolean;
}
