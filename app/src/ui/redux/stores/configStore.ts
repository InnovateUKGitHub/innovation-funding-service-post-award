import { StoreBase } from "./storeBase";

export class ConfigStore extends StoreBase {
  public getConfig() {
    return this.getState().config;
  }

  public isClient(): boolean {
    return this.getState().isClient;
  }

}
