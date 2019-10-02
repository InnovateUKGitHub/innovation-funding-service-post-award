import { StoreBase } from "./storeBase";
import { removeMessages } from "../actions";

export class MsssagesStore extends StoreBase {
  public messages() {
    return this.getState().messages.map(x => x.message);
  }

  public clearMessages() {
    this.queue(removeMessages());
  }
}
