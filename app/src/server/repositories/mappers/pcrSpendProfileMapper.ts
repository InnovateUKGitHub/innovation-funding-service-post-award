import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePcrSpendProfile } from "@server/repositories";
import { PcrSpendProfileEntity } from "@framework/entities/pcrSpendProfile";

export class SalesforcePcrSpendProfileMapper extends SalesforceBaseMapper<ISalesforcePcrSpendProfile, PcrSpendProfileEntity> {
  public map(x: ISalesforcePcrSpendProfile): PcrSpendProfileEntity {
    return {
      id: x.Id,
      costCategoryId: x.Acc_CostCategoryID__c,
      pcrItemId:  x.Acc_ProjectChangeRequest__c,
      costOfRole: x.Acc_CostOfRole__c
    };
  }
}
