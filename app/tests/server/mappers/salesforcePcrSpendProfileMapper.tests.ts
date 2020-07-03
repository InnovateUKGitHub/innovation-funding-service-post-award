import { ISalesforcePcrSpendProfile } from "@server/repositories";
import { SalesforcePcrSpendProfileMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";
import { PcrSpendProfileEntity } from "@framework/entities";
import { PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/constants";
import { DateTime } from "luxon";
import { SALESFORCE_DATE_FORMAT } from "@server/features/common";

const PCR_SPEND_PROFILE_TYPE = "PCR_SPEND_PROFILE_TYPE";

describe("SalesforcePcrSpendProfileMapper", () => {
  it("Maps spend profile correctly to entity", () => {
    const expectedEntity: PcrSpendProfileEntity = {
      id: "id1",
      costCategoryId: "costCatId1",
      pcrItemId: "pcrItemId1",
      value: 50,
      description: "A description",
      dateOtherFundingSecured: DateTime.local(2010, 10, 28).toFormat(SALESFORCE_DATE_FORMAT),
      grossCostOfRole: 10,
      daysSpentOnProject: 11,
      ratePerDay: 12,
      overheadRate: PCRSpendProfileOverheadRate.Twenty,
      quantity: 13,
      costPerItem: 14,
      subcontractorCountry: "Brazil",
      subcontractorRoleAndDescription: "Works on it",
      capitalUsageType: PCRSpendProfileCapitalUsageType.Existing,
      typeLabel: "Existing",
      depreciationPeriod: 6,
      netPresentValue: 120,
      residualValue: 110,
      utilisation: 12.45,
      numberOfTimes: 6,
      costOfEach: 7,
    };

    const pcrSpendProfile: ISalesforcePcrSpendProfile = {
      Id: expectedEntity.id,
      RecordTypeId: PCR_SPEND_PROFILE_TYPE,
      Acc_CostCategoryID__c: expectedEntity.costCategoryId,
      Acc_ProjectChangeRequest__c: expectedEntity.pcrItemId,
      Acc_DateSecured__c: expectedEntity.dateOtherFundingSecured,
      Acc_OverheadRate__c: "20%",
      Acc_ItemDescription__c: expectedEntity.description,
      Acc_TotalCost__c: expectedEntity.value,
      Acc_Country__c: expectedEntity.subcontractorCountry,
      Acc_RoleAndDescription__c: expectedEntity.subcontractorRoleAndDescription,
      Acc_CostPerItem__c: expectedEntity.costPerItem,
      Acc_Quantity__c: expectedEntity.quantity,
      Acc_Rate__c: expectedEntity.ratePerDay,
      Acc_GrossCostOfRole__c: expectedEntity.grossCostOfRole,
      Acc_DaysSpentOnProject__c: expectedEntity.daysSpentOnProject,
      Acc_CostEach__c: expectedEntity.costOfEach,
      Acc_DepreciationPeriod__c: expectedEntity.depreciationPeriod,
      Acc_NetPresentValue__c: expectedEntity.netPresentValue,
      Acc_NewOrExisting__c: "Existing",
      Acc_NumberOfTimes__c: expectedEntity.numberOfTimes,
      Acc_ResidualValue__c: expectedEntity.residualValue,
      Acc_Utilisation__c: expectedEntity.utilisation,
      NewOrExistingLabel: expectedEntity.typeLabel,
    };
    const mapped = new SalesforcePcrSpendProfileMapper(PCR_SPEND_PROFILE_TYPE).map(pcrSpendProfile);
    expect(mapped).toStrictEqual(expectedEntity);
  });
  it("Maps spend profile entity correctly to sf record", () => {
    const entity: PcrSpendProfileEntity = {
      id: "id1",
      costCategoryId: "costCatId1",
      pcrItemId: "pcrItemId1",
      value: 50,
      description: "A description",
      dateOtherFundingSecured: DateTime.local(2010, 10, 28).toFormat(SALESFORCE_DATE_FORMAT),
      grossCostOfRole: 10,
      daysSpentOnProject: 11,
      ratePerDay: 12,
      overheadRate: PCRSpendProfileOverheadRate.Calculated,
      quantity: 13,
      costPerItem: 14,
      subcontractorCountry: "Brazil",
      subcontractorRoleAndDescription: "Works on it",
      capitalUsageType: PCRSpendProfileCapitalUsageType.Existing,
      typeLabel: "Existing",
      depreciationPeriod: 6,
      netPresentValue: 120,
      residualValue: 110,
      utilisation: 12.45,
      numberOfTimes: 6,
      costOfEach: 7,
    };
    const sfRecord: ISalesforcePcrSpendProfile = {
      Id: entity.id,
      RecordTypeId: PCR_SPEND_PROFILE_TYPE,
      Acc_CostCategoryID__c: entity.costCategoryId,
      Acc_ProjectChangeRequest__c: entity.pcrItemId,
      Acc_TotalCost__c: entity.value,
      Acc_ItemDescription__c: entity.description,
      Acc_DateSecured__c: entity.dateOtherFundingSecured,
      Acc_OverheadRate__c: "Calculated",
      Acc_Country__c: entity.subcontractorCountry,
      Acc_RoleAndDescription__c: entity.subcontractorRoleAndDescription,
      Acc_CostPerItem__c: entity.costPerItem,
      Acc_Quantity__c: entity.quantity,
      Acc_Rate__c: entity.ratePerDay,
      Acc_GrossCostOfRole__c: entity.grossCostOfRole,
      Acc_DaysSpentOnProject__c: entity.daysSpentOnProject,
      Acc_CostEach__c: entity.costOfEach,
      Acc_DepreciationPeriod__c: entity.depreciationPeriod,
      Acc_NetPresentValue__c: entity.netPresentValue,
      Acc_NewOrExisting__c: "Existing",
      Acc_NumberOfTimes__c: entity.numberOfTimes,
      Acc_ResidualValue__c: entity.residualValue,
      Acc_Utilisation__c: entity.utilisation,
    };
    const mapped = new SalesforcePcrSpendProfileMapper(PCR_SPEND_PROFILE_TYPE).mapToSalesforce(entity);
    expect(mapped).toStrictEqual(sfRecord);
  });
});
