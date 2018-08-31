import SalesforceBase from "./salesforceBase";
import { range } from "../../shared/range";

export interface ISalesforcePartner {
    Id: string;
    Acc_AccountId__r: {
        Id: string;
        Name: string;
    };
    Acc_ParticipantType__c: string;
    Acc_ParticipantSize__c: string;
    Acc_ProjectRole__c: string;
    Acc_ProjectId__c: string;
}

const fields = [
    "Id",
    "Acc_AccountId__r.Id",
    "Acc_AccountId__r.Name",
    "Acc_ParticipantType__c",
    "Acc_ParticipantSize__c",
    "Acc_ProjectRole__c",
    "Acc_ProjectId__c",
];

export interface IPartnerRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]>;
}

export class PartnerRepository extends SalesforceBase<ISalesforcePartner> implements IPartnerRepository {
    constructor() {
        super("Acc_ProjectParticipant__c", fields);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
        return super.whereFilter(x => x.Acc_ProjectId__c = projectId);
    }
}
