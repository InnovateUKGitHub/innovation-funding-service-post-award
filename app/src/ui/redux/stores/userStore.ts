import { Authorisation } from "@framework/types";
import { StoreBase } from "./storeBase";

export class UserStore extends StoreBase {

  public getCurrentUser() {
    return this.getState().user;
  }

  public getCurrentUserAuthorisation() {
    return new Authorisation(this.getCurrentUser().roleInfo);
  }
}
