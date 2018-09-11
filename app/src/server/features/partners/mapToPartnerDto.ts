import {IContext, IQuery} from "../common/context";
import {PartnerDto} from "../../../ui/models";
import {ISalesforcePartner} from "../../repositories/partnersRepository";

export class MapToPartnerDtoCommand implements IQuery<PartnerDto> {
    constructor(readonly item: ISalesforcePartner) { }
    async Run(context: IContext) {
        const dto: PartnerDto = {
            id: this.item.Id,
            name: this.item.Acc_AccountId__r.Name,
            accountId: this.item.Acc_AccountId__r.Id,
            type: this.item.Acc_ParticipantType__c,
            isLead: this.item.Acc_ProjectRole__c === "Project Lead",
            projectId: this.item.Acc_ProjectId__c,
            totalParticipantGrant: this.item.Acc_TotalParticipantGrant__c,
            totalParticipantCostsClaimed: this.item.Acc_TotalParticipantCosts__c,
            // TODO same as claimed, what is the right field name?
            totalParticipantCostsPaid: this.item.Acc_TotalParticipantCostsPaid__c,
            // TODO this name is a guess, waiting for data model to be updated
            percentageParticipantCostsClaimed: this.item.Acc_PercentageParticipantCosts__c,
            awardRate: this.item.Acc_AwardRate__c,
            capLimit: this.item.Acc_CapLimit__c
        };
        return Promise.resolve(dto);
    }
}
