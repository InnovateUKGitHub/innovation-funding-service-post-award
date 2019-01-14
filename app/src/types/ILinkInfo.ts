import { IUser } from "./IUser";

export interface ILinkInfo {
    routeName: string;
    routeParams: any;
    accessControl: (user: IUser) => boolean;
}
