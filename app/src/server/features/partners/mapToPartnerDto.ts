import { CommandBase, IContext } from "../common/context";
import { ISalesforcePartner, PROJECT_LEAD_IDENTIFIER } from "../../repositories/partnersRepository";

export class MapToPartnerDtoCommand extends CommandBase<PartnerDto> {
    constructor(readonly item: ISalesforcePartner) {
        super();
     }

    calcPercentageClaimed(total: number, claimed: number) {
        return (total && claimed) ? 100 * claimed / total  : null;
    }

    async Run(context: IContext) {
        const dto: PartnerDto = {
            id: this.item.Id,
            name: this.item.Acc_AccountId__r.Name,
            accountId: this.item.Acc_AccountId__r.Id,
            type: this.item.Acc_ParticipantType__c,
            isLead: this.item.Acc_ProjectRole__c === PROJECT_LEAD_IDENTIFIER,
            projectId: this.item.Acc_ProjectId__c,
            totalParticipantGrant: this.item.Acc_TotalParticipantGrant__c,
            totalParticipantCostsClaimed: this.item.Acc_TotalParticipantCosts__c,
            percentageParticipantCostsClaimed: this.calcPercentageClaimed(this.item.Acc_TotalParticipantGrant__c, this.item.Acc_TotalParticipantCosts__c),
            awardRate: this.item.Acc_Award_Rate__c,
            capLimit: this.item.Acc_Cap_Limit__c,
            totalFutureForecastsForParticipants: this.item.Acc_TotalFutureForecastsforParticipant__c,
        };
        return Promise.resolve(dto);
    }
}
