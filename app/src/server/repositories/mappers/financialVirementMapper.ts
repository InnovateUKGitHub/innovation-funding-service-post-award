import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforceFinancialVirement } from "../financialVirementRepository";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";

export class SalesforceFinancialVirementMapper extends SalesforceBaseMapper<ISalesforceFinancialVirement[], PartnerFinancialVirement[]> {
  public map(items: ISalesforceFinancialVirement[]): PartnerFinancialVirement[] {
    return items
      .filter(item => !!item.Acc_ProjectParticipant__c)
      .map(item => this.mapPartner(item, items))
      ;
  }

  private mapPartner(partner: ISalesforceFinancialVirement, allItems: ISalesforceFinancialVirement[]): PartnerFinancialVirement {
    return {
      id: partner.Id,
      pcrItemId: partner.Acc_ProjectChangeRequest__c,
      partnerId: partner.Acc_ProjectParticipant__c,
      virements: allItems
        .filter(item => item !== partner && !!item.Acc_Profile__r && item.Acc_Profile__r.Acc_ProjectParticipant__c === partner.Acc_ProjectParticipant__c)
        .map(item => this.mapVirement(item))
    };
  }

  private mapVirement(virement: ISalesforceFinancialVirement): CostCategoryFinancialVirement {
    return {
      id: virement.Id,
      profileId: virement.Acc_Profile__c,
      costCategoryId: virement.Acc_Profile__r.Acc_CostCategory__c,
      originalEligibleCosts: virement.Acc_CurrentCosts__c,
      originalCostsClaimedToDate: virement.Acc_ClaimedCostsToDate__c,
      newCosts: virement.Acc_NewCosts__c
    };
  }
}
