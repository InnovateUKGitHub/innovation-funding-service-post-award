import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePcrSpendProfile } from "@server/repositories";
import { PcrSpendProfileEntity, PcrSpendProfileEntityForCreate } from "@framework/entities/pcrSpendProfile";
import { Insertable } from "@server/repositories/salesforceRepositoryBase";

export class SalesforcePcrSpendProfileMapper extends SalesforceBaseMapper<ISalesforcePcrSpendProfile, PcrSpendProfileEntity> {
  public constructor(private recordTypeId: string) {
    super();
  }

  public map(x: ISalesforcePcrSpendProfile): PcrSpendProfileEntity {
    return {
      id: x.Id,
      costCategoryId: x.Acc_CostCategoryID__c,
      pcrItemId:  x.Acc_ProjectChangeRequest__c,
      value: x.Acc_CostOfRole__c,

      // Labour
      grossCostOfRole: x.Acc_GrossCostOfRole__c,
      // Can remove Number() wrapper when SF fix Acc_DaysSpentOnProject__c to be a number
      daysSpentOnProject: Number(x.Acc_DaysSpentOnProject__c) || undefined,
      ratePerDay: x.Acc_Rate__c,
      role: x.Acc_Role__c,

      // Materials
      item: x.Acc_Item__c,
      // Can remove Number() wrapper when SF fix Acc_Quantity__c to be a number
      quantity: Number(x.Acc_Quantity__c) || undefined,
      costPerItem: x.Acc_CostPerItem__c,
    };
  }
  public mapToSalesforce(x: PcrSpendProfileEntity): ISalesforcePcrSpendProfile {
    return {
      ...this.mapToSalesforceForCreate(x),
      Id: x.id,
    };
  }
  public mapToSalesforceForCreate(x: PcrSpendProfileEntityForCreate): Insertable<ISalesforcePcrSpendProfile> {
    return {
      RecordTypeId: this.recordTypeId,
      Acc_CostCategoryID__c: x.costCategoryId,
      Acc_ProjectChangeRequest__c:  x.pcrItemId,

      Acc_CostOfRole__c: x.value,

      // Labour
      Acc_DaysSpentOnProject__c: x.daysSpentOnProject,
      Acc_GrossCostOfRole__c: x.grossCostOfRole,
      Acc_Rate__c: x.ratePerDay,
      Acc_Role__c: x.role,

      // Materials
      Acc_Item__c: x.item,
      Acc_CostPerItem__c: x.costPerItem,
      Acc_Quantity__c: x.quantity,
    };
  }
}
