import { StoreBase } from "./storeBase";

export class UserStore extends StoreBase {

  public getCurrentUser() {
    return this.getState().user;
  }
}
