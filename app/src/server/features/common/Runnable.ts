import { IContext, ISyncRunnable } from "@framework/types/IContext";

abstract class RunnableBase<T> implements ISyncRunnable<T> {
  public abstract readonly runnableName: string;

  execute(context: IContext): T {
    newrelic?.addCustomAttribute("acc.runnableName", this.runnableName);
    newrelic?.addCustomAttribute("acc.runnableParams", JSON.stringify(this.logMessage()));
    return this.run(context);
  }

  protected abstract run(context: IContext): T;

  logMessage(): unknown {
    return {};
  }
}

export { RunnableBase };
