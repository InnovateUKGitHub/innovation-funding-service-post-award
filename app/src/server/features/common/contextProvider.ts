import { IContext, Context } from "./context";

class ContextProvider {
  start(): IContext {
    return new Context();
  }
}

export default new ContextProvider();
