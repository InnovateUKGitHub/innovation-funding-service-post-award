import { IContext, IQuery } from "../../common/context";
import { ClaimDetailDto } from "../../../../ui/models";

export class GetAllForPartnerQuery implements IQuery<ClaimDetailDto[]> {
    constructor(private partnerId: string, private periodId: number) {
    }

    public async Run(context: IContext) {
        const results = await context.repositories.claimDetails.getAllByPartnerId(this.partnerId, this.periodId);
        return results && results
            .map(x => ({
                id: x.Id,
                value: x.Acc_CostCategoryValue__c
            }));
    }
}
