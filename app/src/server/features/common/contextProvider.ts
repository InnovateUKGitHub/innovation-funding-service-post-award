import { Context, IContext } from "./context";

class ContextProvider {
  start(params: {user: IUser}): IContext {
    const {user} = params;
    return new Context(user);
  }
}

export default new ContextProvider();
