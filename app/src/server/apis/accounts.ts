import { AccountDto } from "@framework/dtos/accountDto";
import { GetJesAccountsByNameQuery } from "@server/features/accounts/getJesAccountsByName";
import { contextProvider } from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IAccountsApi<Context extends "client" | "server"> {
  getAllByJesName: (params: ApiParams<Context, { searchString?: string }>) => Promise<AccountDto[]>;
}

class Controller extends ControllerBase<"server", AccountDto> implements IAccountsApi<"server"> {
  constructor() {
    super("jes-accounts");

    this.getItems(
      "/",
      (p, q) => ({
        searchString: q.search,
      }),
      p => this.getAllByJesName(p),
    );
  }

  public async getAllByJesName(params: ApiParams<"server", { searchString?: string }>) {
    const query = new GetJesAccountsByNameQuery(params.searchString);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
