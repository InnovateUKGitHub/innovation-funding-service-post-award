import { QueryBase } from "../common/queryBase";
import { GetCostCategoriesQuery } from "../claims";
import { IContext } from "../../../types/IContext";

export class GetClaimDetailsSummaryForPartnerQuery extends QueryBase<ClaimDetailsSummaryDto[]> {
    constructor(private partnerId: string, private periodId: number) {
        super();
    }

    protected async Run(context: IContext) {
        const claimDetailResults = await context.repositories.claimDetails.getAllByPartnerForPeriod(this.partnerId, this.periodId);
        const totalCostCategoryResults = await context.repositories.claimDetails.getAllByPartnerWithPeriodLt(this.partnerId, this.periodId);
        const totalForcastResults = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
        const costCategories = await context.runQuery(new GetCostCategoriesQuery());
        const filteredCostCategories = costCategories.filter(x => x.organisationType === "Industrial"); // Todo: filter based on project

        return filteredCostCategories.map(x => {
            const claimDetail = claimDetailResults.filter(y => y.Acc_CostCategory__c === x.id).map(y => y.Acc_PeriodCostCategoryTotal__c)[0] || 0;
            const forecast = totalForcastResults.filter(y => y.Acc_CostCategory__c === x.id).map(y => y.Acc_CostCategoryGOLCost__c)[0] || 0;
            const totalCostCategory = totalCostCategoryResults.filter(y => y.Acc_CostCategory__c === x.id).map(y => y.Acc_PeriodCostCategoryTotal__c).reduce((t,c) => t + c, 0);

            const offerCosts = forecast || 0;
            const costsClaimedThisPeriod = claimDetail;
            const costsClaimedToDate = totalCostCategory;
            const remainingOfferCosts = offerCosts - totalCostCategory - costsClaimedThisPeriod;

            return ({
                costCategoryId: x.id,
                offerCosts,
                costsClaimedToDate,
                costsClaimedThisPeriod,
                remainingOfferCosts
        });}
    );
    }
}
