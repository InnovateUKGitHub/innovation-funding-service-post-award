import { Authorisation, IContext } from "@framework/types";

export abstract class NonAuthorisedCommandBase<T> {
  protected abstract Run(context: IContext): Promise<T>;

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class CommandBase<T> {
  protected abstract Run(context: IContext): Promise<T>;

  protected accessControl(auth: Authorisation, context: IContext) {
    return Promise.resolve(true);
  }

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class SyncCommandBase<T> {
  protected abstract Run(context: IContext): T;

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}
