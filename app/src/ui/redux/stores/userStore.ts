import { StoreBase } from "./storeBase";
import { Authorisation } from "@framework/types";

export class UserStore extends StoreBase {

  public getCurrentUser() {
    return this.getState().user;
  }

  public getCurrentUserAuthorisation() {
    return new Authorisation(this.getCurrentUser().roleInfo);
  }
}
