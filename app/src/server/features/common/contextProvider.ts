import { IContext, ISessionUser } from "@framework/types";
import { Context } from "./context";

class ContextProvider {
  start(params: { user: ISessionUser }): IContext {
    const { user } = params;
    return new Context(user);
  }
}

export default new ContextProvider();
