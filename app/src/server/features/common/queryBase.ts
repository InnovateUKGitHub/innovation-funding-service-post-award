/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { Authorisation, IContext } from "@framework/types";

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
