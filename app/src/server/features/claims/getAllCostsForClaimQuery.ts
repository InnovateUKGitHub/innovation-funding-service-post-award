import { IContext, IQuery } from "../common/context";
import { ClaimCostDto } from "../../../ui/models/claimCostDto";

export class GetAllCostsForClaimQuery implements IQuery<ClaimCostDto[]>{
    constructor(public claimId: string) {
    }

    public async Run(context: IContext) {
        const data = await context.repositories.claimCosts.getAllForClaim(this.claimId) || [];

        return data.map<ClaimCostDto>(item => ({
            offerCosts: item.Acc_GolValue__c,
            costsClaimedToDate: item.Acc_TotalGolvalue__c,
            costsClaimedThisPeriod: item.Acc_TotalValue__c,
            remainingOfferCosts: item.Acc_TotalFutureCostCategoryValue__C,
            costCategoryId: item.Acc_CostCategoryID__c
        }));
    }
}