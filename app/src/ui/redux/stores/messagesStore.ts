import { removeMessages } from "../actions/common/messageActions";
import { StoreBase } from "./storeBase";

export class MessagesStore extends StoreBase {
  public messages() {
    return this.getState().messages.map(x => x.message);
  }

  public clearMessages() {
    this.queue(removeMessages());
  }
}
