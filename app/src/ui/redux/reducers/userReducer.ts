import { RootActions } from "../actions/root";
import { IClientUser } from "@framework/types/IUser";

export const userReducer = (state = {} as IClientUser, action: RootActions) => {
  // no update on client side this is initialised from server
  return state;
};
