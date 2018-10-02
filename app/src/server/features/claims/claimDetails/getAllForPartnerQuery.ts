import { IContext, IQuery } from "../../common/context";
import { ClaimDetailsDto } from "../../../../ui/models";
import { ISalesforceClaim, ISalesforceClaimDetails, ISalesforceClaimTotalCostCategory } from "../../../repositories";
import { GetCostCategoriesQuery } from "../getCostCategoriesQuery";

export class GetAllForPartnerQuery implements IQuery<ClaimDetailsDto[]> {
    constructor(private partnerId: string, private periodId: number) {
    }

    public async Run(context: IContext) {
        const claimDetailResults = await context.repositories.claimDetails.getAllByPartnerId(this.partnerId, this.periodId);
        const totalCostCategoryResults = await context.repositories.claimDetails.getAllPreviousByPartnerId(this.partnerId, this.periodId);

        const costCategories = await context.runQuery(new GetCostCategoriesQuery());
        const filteredCostCategories = costCategories.filter(x => x.organistionType === "Industrial"); // Todo: filter based on project

        return filteredCostCategories.map(x => {
            const claimDetail = claimDetailResults.filter(y => y.Acc_CostCategory__c === x.id).map(y => y.Acc_PeriodCostCategoryTotal__c)[0] || 0;

            const totalCostCategory = totalCostCategoryResults.filter(y => y.Acc_CostCategory__c === x.id).map(y => y.Acc_PeriodCostCategoryTotal__c).reduce((t,c) => t + c, 0);

            const offerCosts = 100000; // TODO: remove fake data
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
