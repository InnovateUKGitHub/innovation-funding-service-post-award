import { AccountDto, IContext } from "@framework/types";
import { QueryBase } from "../common";
import { mapToAccountDto } from "./mapToAccountDto";

export class GetAccountsQuery extends QueryBase<AccountDto[]> {
  constructor() {
    super();
  }

  async Run(context: IContext) {
    const items = await context.repositories.accounts.getAccounts();
    return items.map(account => mapToAccountDto(context, account));
  }
}
