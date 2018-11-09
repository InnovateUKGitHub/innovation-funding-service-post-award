import { RootActions } from "../actions/root";

export const userReducer = (state: IUser = {} as IUser, action: RootActions) => {
  // no update on client side this is initialised from server
  return state;
};
