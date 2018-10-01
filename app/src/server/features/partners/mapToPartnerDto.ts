import { IContext, IQuery } from "../common/context";
import { PartnerDto } from "../../../ui/models";
import { ISalesforcePartner } from "../../repositories/partnersRepository";

export class MapToPartnerDtoCommand implements IQuery<PartnerDto> {
    constructor(readonly item: ISalesforcePartner) { }

    calcPercentageClaimed(total: number, claimed: number) {
        // ToDo: Remove fake data
        if (!total) {
            total = 1000000;
        }
        if (!claimed) {
            claimed = 10000;
        }
        return (total && claimed) ? Math.ceil((claimed / total) * 100) : null;
    }

    async Run(context: IContext) {
        const dto: PartnerDto = {
            id: this.item.Id,
            name: this.item.Acc_AccountId__r.Name,
            accountId: this.item.Acc_AccountId__r.Id,
            type: this.item.Acc_ParticipantType__c,
            isLead: this.item.Acc_ProjectRole__c === "Project Lead",
            projectId: this.item.Acc_ProjectId__c,
            totalParticipantGrant: this.item.Acc_TotalParticipantGrant__c || 1000000, // ToDo: Remove fake data
            totalParticipantCostsClaimed: this.item.Acc_TotalParticipantCosts__c || 10000, // ToDo: Remove fake data
            totalParticipantCostsPaid: this.item.Acc_TotalParticipantCostsPaid__c,
            percentageParticipantCostsClaimed: this.calcPercentageClaimed(this.item.Acc_TotalParticipantGrant__c, this.item.Acc_TotalParticipantCosts__c),
            awardRate: this.item.Acc_Award_Rate__c,
            capLimit: this.item.Acc_Cap_Limit__c
        };
        return Promise.resolve(dto);
    }
}
