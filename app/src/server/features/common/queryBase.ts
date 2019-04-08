import { Authorisation, IContext } from "../../../types";

export abstract class QueryBase<T> {
  protected abstract Run(context: IContext): Promise<T>;

  protected accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}

export abstract class SyncQueryBase<T> {
  protected abstract Run(context: IContext): T;

  protected LogMessage(): any {
    return [this.constructor.name, this];
  }
}
