import { Context, IContext } from './context';

class ContextProvider {
  start(): IContext {
    return new Context();
  }
}

export default new ContextProvider();
