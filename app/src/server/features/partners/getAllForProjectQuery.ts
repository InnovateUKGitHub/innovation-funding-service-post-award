import { IContext, IQuery } from "../common/context";
import { PartnerDto } from "../../../models/PartnerDto";

export class GetAllForProjectQuery implements IQuery<PartnerDto[]> {
    constructor(private projectId: string) {
    }

    public async Run(context: IContext) {
        const results = await context.repositories.partners.getAllByProjectId(this.projectId);
        return results.map(x => ({
            id: x.Id,
            name: x.Acc_AccountId__r.Name,
            accountId: x.Acc_AccountId__r.Id,
            type: x.Acc_ParticipantType__c,
            isLead: x.Acc_ProjectRole__c === "Project Lead",
            projectId: x.Acc_ProjectId__c
        } as PartnerDto));
    }
}
