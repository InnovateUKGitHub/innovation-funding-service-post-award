import { AccountDto } from "@framework/dtos";
import { GetAccountsQuery } from "@server/features/accounts/getAccounts";
import contextProvider from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IAccountsApi {
  getAll: (params: ApiParams<{}>) => Promise<AccountDto[]>;
}

class Controller extends ControllerBase<AccountDto> implements IAccountsApi {

  constructor() {
    super("accounts");

    super.getItems("/", p => ({}), (p) => this.getAll(p));
  }

  public async getAll(params: ApiParams<{}>) {
    const query = new GetAccountsQuery();
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
