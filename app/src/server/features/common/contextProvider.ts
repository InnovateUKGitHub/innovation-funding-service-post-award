import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";

class ContextProvider {
  start(params: { user: ISessionUser; requestId: string }): IContext {
    return new Context(params);
  }
}

export const contextProvider = new ContextProvider();
