import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";

class ContextProvider {
  start(params: { user: ISessionUser }): IContext {
    return new Context(params.user);
  }
}

export const contextProvider = new ContextProvider();
