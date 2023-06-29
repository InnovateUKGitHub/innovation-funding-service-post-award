import { ApiParams, ControllerBase } from "./controllerBase";

interface UserDto {
  email: string;
}

export interface IUserApi<Context extends "client" | "server"> {
  getCurrent: (params: ApiParams<Context>) => Promise<UserDto>;
}

class Controller extends ControllerBase<"server", UserDto> implements IUserApi<"server"> {
  constructor() {
    super("users");

    super.getItem(
      "/current",
      () => ({}),
      p => this.getCurrent(p),
    );
  }

  getCurrent(params: ApiParams<"server">) {
    return Promise.resolve<UserDto>({ email: params.user.email });
  }
}

export const controller = new Controller();
