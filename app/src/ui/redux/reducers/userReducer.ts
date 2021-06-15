import { IClientUser } from "@framework/types/IUser";

export const userReducer = (state = {} as IClientUser) => {
  // no update on client side this is initialised from server
  return state;
};
