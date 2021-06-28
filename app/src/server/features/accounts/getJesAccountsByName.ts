import { AccountDto, IContext } from "@framework/types";
import { String } from "aws-sdk/clients/appstream";
import { QueryBase } from "../common";
import { mapToAccountDto } from "./mapToAccountDto";

export class GetJesAccountsByNameQuery extends QueryBase<AccountDto[]> {
  constructor(private searchString?: String) {
    super();
  }

  async run(context: IContext) {
    const items = await context.repositories.accounts.getAllByJesName(this.searchString);
    return items.map(account => mapToAccountDto(account));
  }
}
