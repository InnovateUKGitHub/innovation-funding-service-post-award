import { removeError } from "../actions";
import { StoreBase } from "./storeBase";

export class ErrorStore extends StoreBase {
  public errors() {
    return this.getState().globalError;
  }

  public clearErrors() {
    this.queue(removeError());
  }
}
