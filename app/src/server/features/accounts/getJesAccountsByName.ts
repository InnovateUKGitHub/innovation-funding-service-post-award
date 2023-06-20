import { AccountDto } from "@framework/dtos/accountDto";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { mapToAccountDto } from "./mapToAccountDto";

export class GetJesAccountsByNameQuery extends QueryBase<AccountDto[]> {
  constructor(private searchString?: string) {
    super();
  }

  async run(context: IContext) {
    const items = await context.repositories.accounts.getAllByJesName(this.searchString);
    return items.map(account => mapToAccountDto(account));
  }
}
