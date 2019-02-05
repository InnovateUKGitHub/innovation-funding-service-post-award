import { Context } from "./context";
import { IContext, IUser } from "../../../types";

class ContextProvider {
  start(params: {user: IUser}): IContext {
    const {user} = params;
    return new Context(user);
  }
}

export default new ContextProvider();
