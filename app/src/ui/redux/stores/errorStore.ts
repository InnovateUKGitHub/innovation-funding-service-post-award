import { removeError } from "../actions/common/errorActions";
import { StoreBase } from "./storeBase";

export class ErrorStore extends StoreBase {
  public errors() {
    return this.getState().globalError;
  }

  public clearErrors() {
    this.queue(removeError());
  }
}
