import { Context, IContext } from "./context";
import { IUser } from "../../../shared/IUser";

class ContextProvider {
  start(user: IUser): IContext {
    return new Context(user);
  }
}

export default new ContextProvider();
