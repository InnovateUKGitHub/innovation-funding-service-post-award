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
            projectId: this.item.Acc_ProjectId__c
        };
        return Promise.resolve(dto);
    }
}
