/* eslint-disable @typescript-eslint/no-unused-vars */ // Note: due to this file being extended, it's okay for there to be unused params as they're required for children
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { RunnableBase } from "./Runnable";

export abstract class SyncQueryBase<T> extends RunnableBase<T> {}
export abstract class AsyncQueryBase<T> extends SyncQueryBase<Promise<T>> {}
export abstract class AuthorisedAsyncQueryBase<T> extends AsyncQueryBase<T> {
  public accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    return Promise.resolve(true);
  }
}
