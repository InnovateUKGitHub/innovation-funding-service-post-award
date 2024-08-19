import { IContext } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { Context } from "./context";

class ContextProvider {
  async start(params: { user: ISessionUser; tid: string }): Promise<IContext> {
    const context = new Context(params);
    await context.init();
    return context;
  }
}

export const contextProvider = new ContextProvider();
