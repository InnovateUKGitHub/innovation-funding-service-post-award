import { IClientUser } from "./IUser";

export interface IRequest {
  user: IClientUser;
  requestId: string;
}
