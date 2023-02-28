import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import { ISalesforceFinancialVirement } from "../financialVirementRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class SalesforceFinancialVirementMapper extends SalesforceBaseMapper<
  ISalesforceFinancialVirement[],
  PartnerFinancialVirement[]
> {
  constructor(private readonly partnerLevelRecordType: string, private readonly costCategoryLevelRecordType: string) {
    super();
  }

  public map(items: ISalesforceFinancialVirement[]): PartnerFinancialVirement[] {
    const partnerItems = items.filter(x => x.RecordTypeId === this.partnerLevelRecordType);
    const costCategoryItems = items.filter(
      x => x.RecordTypeId === this.costCategoryLevelRecordType && x.Acc_Profile__r.Acc_CostCategory__c,
    );

    return partnerItems.map(item => this.mapPartnerVirement(item, costCategoryItems));
  }

  private mapPartnerVirement(
    partnerItem: ISalesforceFinancialVirement,
    costCategoryItems: ISalesforceFinancialVirement[],
  ): PartnerFinancialVirement {
    const filteredItems = costCategoryItems.filter(
      item => item.Acc_Profile__r?.Acc_ProjectParticipant__c === partnerItem.Acc_ProjectParticipant__c,
    );

    return {
      id: partnerItem.Id,
      pcrItemId: partnerItem.Acc_ProjectChangeRequest__c,
      partnerId: partnerItem.Acc_ProjectParticipant__c as PartnerId,
      newFundingLevel: partnerItem.Acc_NewAwardRate__c,
      originalFundingLevel: partnerItem.Acc_CurrentAwardRate__c,
      newEligibleCosts: partnerItem.Acc_NewTotalEligibleCosts__c,
      newRemainingGrant: partnerItem.Acc_NewRemainingGrant__c,
      virements: filteredItems.map(x => this.mapVirement(x)),
    };
  }

  private mapVirement(costCategoryItem: ISalesforceFinancialVirement): CostCategoryFinancialVirement {
    return {
      id: costCategoryItem.Id,
      profileId: costCategoryItem.Acc_Profile__c,
      costCategoryId: costCategoryItem.Acc_Profile__r.Acc_CostCategory__c,
      originalEligibleCosts: costCategoryItem.Acc_CurrentCosts__c,
      originalCostsClaimedToDate: costCategoryItem.Acc_ClaimedCostsToDate__c,
      newEligibleCosts: costCategoryItem.Acc_NewCosts__c,
    };
  }
}
