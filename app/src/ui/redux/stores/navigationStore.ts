import { ILinkInfo } from "@framework/types";
import { createRouteNodeSelector } from "redux-router5";
import { navigateTo } from "../actions";
import { StoreBase } from "./storeBase";

export class NavigationStore extends StoreBase {
  navigateTo(routeInfo: ILinkInfo, replace = false) {
    this.queue(navigateTo(routeInfo, replace));
  }

  private getRouteInfo() {
    return createRouteNodeSelector("")(this.getState());
  }

  public getRoute() {
    return this.getRouteInfo().route!;
  }

  public getLoadStatus() {
    return this.getState().loadStatus;
  }

  public getPageTitle() {
    return this.getState().title;
  }

}
