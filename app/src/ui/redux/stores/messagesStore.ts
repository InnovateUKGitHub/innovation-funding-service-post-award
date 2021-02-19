import { removeMessages } from "../actions";
import { StoreBase } from "./storeBase";

export class MessagesStore extends StoreBase {
  public messages() {
    return this.getState().messages.map(x => x.message);
  }

  public clearMessages() {
    this.queue(removeMessages());
  }
}
