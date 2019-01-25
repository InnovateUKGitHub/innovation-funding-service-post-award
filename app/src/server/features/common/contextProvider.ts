import { Context } from "./context";
import { IUser } from "../../../types/IUser";
import { IContext } from "../../../types/IContext";

class ContextProvider {
  start(params: {user: IUser}): IContext {
    const {user} = params;
    return new Context(user);
  }
}

export default new ContextProvider();
