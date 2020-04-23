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

      // Labour
      costOfRole: x.Acc_CostOfRole__c,
      daysSpentOnProject: x.Acc_DaysSpentOnProject__c,
      grossCostOfRole: x.Acc_GrossCostOfRole__c,
      ratePerDay: x.Acc_Rate__c,
      role: x.Acc_Role__c,
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

      // Labour
      Acc_CostOfRole__c: x.costOfRole,
      Acc_DaysSpentOnProject__c: x.daysSpentOnProject,
      Acc_GrossCostOfRole__c: x.grossCostOfRole,
      Acc_Rate__c: x.ratePerDay,
      Acc_Role__c: x.role,
    };
  }
}
