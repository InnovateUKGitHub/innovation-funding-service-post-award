import { StoreBase } from "./storeBase";
import { ILinkInfo } from "@framework/types";
import { navigateTo } from "../actions";
import { createRouteNodeSelector } from "redux-router5";

export class NavigationStore extends StoreBase {
  navigateTo(routeInfo: ILinkInfo, replace: boolean = false) {
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
