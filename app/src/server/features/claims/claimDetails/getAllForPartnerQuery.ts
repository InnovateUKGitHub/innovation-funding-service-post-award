import { IContext, IQuery } from "../../common/context";
import { ClaimCostDto } from "../../../../ui/models";
import { ISalesforceClaim, ISalesforceClaimDetails, ISalesforceClaimTotalCostCategory } from "../../../repositories";

export class GetAllForPartnerQuery implements IQuery<ClaimCostDto[]> {
    constructor(private partnerId: string, private periodId: number) {
    }

    public async Run(context: IContext) {
        const claimDetailResults = await context.repositories.claimDetails.getAllByPartnerId(this.partnerId, this.periodId);
        const totalCostCategoryResults = await context.repositories.claimTotalCostCategory.getAllByPartnerId(this.partnerId);
        const fakeCostCategories = [
            { id: "1", name: "Labour" },
            { id: "2", name: "Overheads" },
            { id: "3", name: "Materials" },
            { id: "4", name: "Capital usage" },
            { id: "5", name: "Subcontracting" },
            { id: "6", name: "Travel and subsistence" },
            { id: "7", name: "Other costs" },
        ];

        const claimDetailMap = claimDetailResults.reduce((result, claimDetail) => {
            result[claimDetail.Acc_CostCategory__c] = claimDetail;
            return result;
        }, {} as {[key: string]: ISalesforceClaimDetails});

        const totalCostCategoryMap = totalCostCategoryResults.reduce((result, totalCostCategory) => {
            result[totalCostCategory.Acc_CostCategory__c] = totalCostCategory;
            return result;
        }, {} as { [key: string]: ISalesforceClaimTotalCostCategory });

        return fakeCostCategories && fakeCostCategories.map(x => ({
            costCategoryId: x.id,
            costsClaimedThisPeriod: claimDetailMap[x.id] && claimDetailMap[x.id].Acc_PeriodCostCategoryTotal__c,
            costsClaimedToDate: totalCostCategoryMap[x.id] && totalCostCategoryMap[x.id].Acc_CostCategoryTotal__c
        }));
    }
}
