/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";

export abstract class QueryBase<T> {
  protected abstract run(context: IContext): Promise<T>;

  protected accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected logMessage(): unknown {
    return [this.constructor.name, this];
  }
}

export abstract class SyncQueryBase<T> {
  protected abstract run(context: IContext): T;

  protected logMessage(): unknown {
    return [this.constructor.name, this];
  }
}
