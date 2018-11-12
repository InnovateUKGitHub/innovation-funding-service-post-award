import { ApiParams, ControllerBase } from "./controllerBase";

interface UserDto {
  email: string;
}

export interface IUserApi {
  getCurrent: (params: ApiParams<{}>) => Promise<UserDto>;
}

class Controller extends ControllerBase<UserDto> implements IUserApi {
  constructor() {
    super("users");

    super.getItem("/current", p => ({}), (p) => this.getCurrent(p));
  }

  getCurrent(params: ApiParams<{}>) {
    return Promise.resolve<UserDto>({email: params.user.email});
  }
}

export const controller = new Controller();
