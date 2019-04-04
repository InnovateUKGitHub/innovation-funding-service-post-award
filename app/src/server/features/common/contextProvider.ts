import { Context } from "./context";
import { IContext, ISessionUser } from "../../../types";

class ContextProvider {
  start(params: { user: ISessionUser }): IContext {
    const { user } = params;
    return new Context(user);
  }
}

export default new ContextProvider();
