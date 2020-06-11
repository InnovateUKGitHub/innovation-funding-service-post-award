import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePcrSpendProfile } from "@server/repositories";
import { PcrSpendProfileEntity, PcrSpendProfileEntityForCreate } from "@framework/entities/pcrSpendProfile";
import { Insertable } from "@server/repositories/salesforceRepositoryBase";
import { PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/constants";
import { isNumber } from "@framework/util";

export class SalesforcePcrSpendProfileMapper extends SalesforceBaseMapper<ISalesforcePcrSpendProfile, PcrSpendProfileEntity> {
  public constructor(private recordTypeId: string) {
    super();
  }

  public map(x: ISalesforcePcrSpendProfile): PcrSpendProfileEntity {
    return {
      id: x.Id,
      costCategoryId: x.Acc_CostCategoryID__c,
      pcrItemId:  x.Acc_ProjectChangeRequest__c,
      value: x.Acc_TotalCost__c,
      description: x.Acc_ItemDescription__c,

      // Labour
      grossCostOfRole: x.Acc_GrossCostOfRole__c,
      // Can remove Number() wrapper when SF fix Acc_DaysSpentOnProject__c to be a number
      daysSpentOnProject: Number(x.Acc_DaysSpentOnProject__c) || undefined,
      ratePerDay: x.Acc_Rate__c,

      // Materials
      // Can remove Number() wrapper when SF fix Acc_Quantity__c to be a number
      quantity: Number(x.Acc_Quantity__c) || undefined,
      costPerItem: x.Acc_CostPerItem__c,

      // Subcontracting
      subcontractorCountry: x.Acc_Country__c || undefined,
      subcontractorRoleAndDescription: x.Acc_RoleAndDescription__c || undefined,

      // Capital Usage
      capitalUsageType: new PcrSpendProfileCapitalUsageTypeMapper().mapFromSalesforcePcrSpendProfileCapitalUsageType(x.Acc_NewOrExisting__c),
      typeLabel: x.NewOrExistingLabel || undefined,
      // Can remove Number() wrapper when SF fix Acc_DepreciationPeriod__c to be a number
      depreciationPeriod: Number(x.Acc_DepreciationPeriod__c) || undefined,
      netPresentValue: x.Acc_NetPresentValue__c,
      residualValue: x.Acc_ResidualValue__c,
      utilisation: x.Acc_Utilisation__c,

      // Travel and Subsitance
      // Can remove Number() wrapper when SF fix Acc_NumberOfTimes__c to be a number
      numberOfTimes: Number(x.Acc_NumberOfTimes__c) || undefined,
      costOfEach: x.Acc_CostEach__c,
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

      Acc_TotalCost__c: isNumber(x.value) ? x.value : null,
      Acc_ItemDescription__c: x.description || null,

      // Labour
      Acc_DaysSpentOnProject__c: x.daysSpentOnProject,
      Acc_GrossCostOfRole__c: x.grossCostOfRole,
      Acc_Rate__c: x.ratePerDay,

      // Materials
      Acc_CostPerItem__c: x.costPerItem,
      Acc_Quantity__c: x.quantity,

      // Subcontracting
      Acc_Country__c: x.subcontractorCountry,
      Acc_RoleAndDescription__c: x.subcontractorRoleAndDescription,

      // Capital Usage
      Acc_NewOrExisting__c: new PcrSpendProfileCapitalUsageTypeMapper().mapToSalesforcePcrSpendProfileCapitalUsageType(x.capitalUsageType),
      Acc_DepreciationPeriod__c: x.depreciationPeriod,
      Acc_NetPresentValue__c: x.netPresentValue,
      Acc_ResidualValue__c: x.residualValue,
      Acc_Utilisation__c: x.utilisation,

      // Travel and Subsistance
      Acc_NumberOfTimes__c: x.numberOfTimes,
      Acc_CostEach__c: x.costOfEach,
    };
  }
}

export class PcrSpendProfileCapitalUsageTypeMapper {
  private types = {
    new: "New",
    existing: "Existing",
  };

  public mapFromSalesforcePcrSpendProfileCapitalUsageType = ((types: string | null): PCRSpendProfileCapitalUsageType => {
    switch (types) {
      case this.types.new: return PCRSpendProfileCapitalUsageType.New;
      case this.types.existing: return PCRSpendProfileCapitalUsageType.Existing;
      default: return PCRSpendProfileCapitalUsageType.Unknown;
    }
  });

  public mapToSalesforcePcrSpendProfileCapitalUsageType = ((types: PCRSpendProfileCapitalUsageType | undefined) => {
    switch (types) {
      case PCRSpendProfileCapitalUsageType.New: return this.types.new;
      case PCRSpendProfileCapitalUsageType.Existing: return this.types.existing;
      default: return null;
    }
  });
}

// Unlike other picklist types which are enums, overhead rate can be a number to allow it to be used to calculate overhead cost
export class PcrSpendProfileOverheadRateMapper {
  private options = {
    zero: "0%",
    twenty: "20%",
    calculated: "Calculated",
  };

  public mapFromSalesforcePcrSpendProfileOverheadRateOption = ((option: string | undefined): PCRSpendProfileOverheadRate => {
    switch (option) {
      case this.options.zero: return 0;
      case this.options.twenty: return 20;
      case this.options.calculated: return "calculated";
      default: return "unknown";
    }
  });

  public mapToSalesforcePcrSpendProfileOverheadRateOption = ((types: PCRSpendProfileOverheadRate | undefined) => {
    switch (types) {
      case 0: return this.options.zero;
      case 20: return this.options.twenty;
      case "calculated": return this.options.calculated;
      default: return undefined;
    }
  });
}
