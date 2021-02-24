import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import { ISalesforceFinancialVirement } from "../financialVirementRepository";
import { SalesforceBaseMapper } from "./saleforceMapperBase";

export class SalesforceFinancialVirementMapper extends SalesforceBaseMapper<ISalesforceFinancialVirement[], PartnerFinancialVirement[]> {
  constructor(private readonly partnerLevelRecordType: string, private readonly costCategoryLevelRecordType: string) {
    super();
  }

  public map(items: ISalesforceFinancialVirement[]): PartnerFinancialVirement[] {
    const partnerItems = items.filter(x => x.RecordTypeId === this.partnerLevelRecordType);
    const costCategoryItems = items.filter(x =>  x.RecordTypeId === this.costCategoryLevelRecordType);

    return partnerItems
      .map(item => this.mapPartner(item, costCategoryItems))
      ;
  }

  private mapPartner(partnerItem: ISalesforceFinancialVirement, costCategoryItems: ISalesforceFinancialVirement[]): PartnerFinancialVirement {
    return {
      id: partnerItem.Id,
      pcrItemId: partnerItem.Acc_ProjectChangeRequest__c,
      partnerId: partnerItem.Acc_ProjectParticipant__c,
      newFundingLevel: partnerItem.Acc_NewAwardRate__c,
      originalFundingLevel: partnerItem.Acc_CurrentAwardRate__c,
      newEligibleCosts: partnerItem.Acc_NewTotalEligibleCosts__c,
      newRemainingGrant: partnerItem.Acc_NewRemainingGrant__c,
      virements: costCategoryItems
        .filter(item => item.Acc_Profile__r && item.Acc_Profile__r.Acc_ProjectParticipant__c === partnerItem.Acc_ProjectParticipant__c)
        .map(item => this.mapVirement(item))
    };
  }

  private mapVirement(costCategoryItem: ISalesforceFinancialVirement): CostCategoryFinancialVirement {
    return {
      id: costCategoryItem.Id,
      profileId: costCategoryItem.Acc_Profile__c,
      costCategoryId: costCategoryItem.Acc_Profile__r.Acc_CostCategory__c,
      originalEligibleCosts: costCategoryItem.Acc_CurrentCosts__c,
      originalCostsClaimedToDate: costCategoryItem.Acc_ClaimedCostsToDate__c,
      newEligibleCosts: costCategoryItem.Acc_NewCosts__c
    };
  }
}
