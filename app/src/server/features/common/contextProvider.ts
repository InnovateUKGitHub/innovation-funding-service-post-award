import { Context, IContext } from "./context";
import { IUser } from "../../../shared/IUser";

class ContextProvider {
  start(params: {user: IUser}): IContext {
    const {user} = params;
    return new Context(user);
  }
}

export default new ContextProvider();
