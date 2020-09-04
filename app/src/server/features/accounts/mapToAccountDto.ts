// tslint:disable:no-bitwise
import { AccountDto, IContext } from "@framework/types";
import { ISalesforceAccount } from "@server/repositories/accountsRepository";

export const mapToAccountDto = (
  context: IContext,
  item: ISalesforceAccount,
): AccountDto => {
  return {
    companyName: item.Name,
  };
};
