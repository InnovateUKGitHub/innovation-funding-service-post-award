import { RootActions } from "../actions/root";
import { IUser } from "../../../types/IUser";

export const userReducer = (state: IUser = {} as IUser, action: RootActions) => {
  // no update on client side this is initialised from server
  return state;
};
