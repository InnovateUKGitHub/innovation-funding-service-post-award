import { ApiParams, ControllerBase, ISession } from "./controllerBase";
import { Configuration } from "../features/common";

export interface IVersionApi {
  getCurrent: (params: ApiParams<{}>) => Promise<string>;
}

class Controller extends ControllerBase<string> implements IVersionApi {
  constructor() {
    super("version");

    super.getItem("/", p => ({}), (p) => this.getCurrent(p));
  }

  getCurrent(p: ISession): Promise<string> {
    return Promise.resolve(Configuration.build);
  }
}

export const controller = new Controller();
