import { AccountDto } from "@framework/types";
import { ISalesforceAccount } from "@server/repositories/accountsRepository";

export const mapToAccountDto = (item: ISalesforceAccount): AccountDto => ({
  id: item.Id,
  companyName: item.Name,
  jesEnabled: item.JES_Organisation__c === "Yes",
});
