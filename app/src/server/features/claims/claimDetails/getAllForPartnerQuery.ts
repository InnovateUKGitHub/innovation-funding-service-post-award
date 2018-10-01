import { IContext, IQuery } from "../../common/context";
import { ClaimCostDto } from "../../../../ui/models";
import { ISalesforceClaim, ISalesforceClaimDetails, ISalesforceClaimTotalCostCategory } from "../../../repositories";

export class GetAllForPartnerQuery implements IQuery<ClaimCostDto[]> {
    constructor(private partnerId: string, private periodId: number) {
    }

    public async Run(context: IContext) {
        const claimDetailResults = await context.repositories.claimDetails.getAllByPartnerId(this.partnerId, this.periodId);
        const totalCostCategoryResults = await context.repositories.claimTotalCostCategory.getAllByPartnerId(this.partnerId);
        const costCategiries = await context.repositories.costCategories.getAll();

        const claimDetailMap = claimDetailResults.reduce((result, claimDetail) => {
            result[claimDetail.Acc_CostCategory__c] = claimDetail;
            return result;
        }, {} as {[key: string]: ISalesforceClaimDetails});

        const totalCostCategoryMap = totalCostCategoryResults.reduce((result, totalCostCategory) => {
            result[totalCostCategory.Acc_CostCategory__c] = totalCostCategory;
            return result;
        }, {} as { [key: string]: ISalesforceClaimTotalCostCategory });

        return costCategiries && costCategiries.sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c).map(x => ({
            costCategoryId: x.Id,
            offerCosts: claimDetailMap[x.Id].Acc_PeriodCostCategoryTotal__c * 10, // TODO: remove fake data
            costsClaimedToDate: totalCostCategoryMap[x.Id] && totalCostCategoryMap[x.Id].Acc_CostCategoryTotal__c - claimDetailMap[x.Id].Acc_PeriodCostCategoryTotal__c,
            costsClaimedThisPeriod: claimDetailMap[x.Id] && claimDetailMap[x.Id].Acc_PeriodCostCategoryTotal__c,
            remainingOfferCosts: (claimDetailMap[x.Id].Acc_PeriodCostCategoryTotal__c * 10) - // TODO: remove fake data
                ((totalCostCategoryMap[x.Id].Acc_CostCategoryTotal__c - claimDetailMap[x.Id].Acc_PeriodCostCategoryTotal__c) + claimDetailMap[x.Id].Acc_PeriodCostCategoryTotal__c)
        }));
    }
}
