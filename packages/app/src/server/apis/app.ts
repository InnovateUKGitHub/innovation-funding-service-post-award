import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { noop } from "lodash";

export interface IAppApi<Context extends "client" | "server"> {
  heartbeat(params: ApiParams<Context, null>): Promise<boolean>;
}

class AppController extends ControllerBase<"server", boolean> implements IAppApi<"server"> {
  constructor() {
    super("app");

    this.getItem("/heartbeat", noop, this.heartbeat);
  }

  public async heartbeat(): Promise<boolean> {
    return true;
  }
}

export const controller = new AppController();
