import { IContext, ISessionUser } from "@framework/types";
import { Context } from "./context";

class ContextProvider {
  start(params: { user: ISessionUser }): IContext {
    return new Context(params.user);
  }
}

export const contextProvider = new ContextProvider();
