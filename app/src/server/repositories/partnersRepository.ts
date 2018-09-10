import SalesforceBase from "./salesforceBase";

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
    Acc_TotalParticipantGrant__c: number;
    Acc_TotalParticipantCosts__c: number;
    Acc_TotalParticipantCostsPaid__c: number;
    Acc_PercentageParticipantCosts__c: number;
    Acc_CapLimit__c: number;
    Acc_AwardRate__c: number;
}

const fields = [
    "Id",
    "Acc_AccountId__r.Id",
    "Acc_AccountId__r.Name",
    "Acc_ParticipantType__c",
    "Acc_ParticipantSize__c",
    // TODO "Acc_TotalParticipantGrant__c",
    // TODO "Acc_TotalParticipantCosts__c",
    // TODO "Acc_CapLimit__c",
    // TODO "Acc_AwardRate__c",
    // TODO "Acc_TotalProjectCosts__c",
    "Acc_ProjectRole__c",
    "Acc_ProjectId__c",
];

export interface IPartnerRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]>;
    getById(partnerId: string): Promise<ISalesforcePartner | null>;
}

export class PartnerRepository extends SalesforceBase<ISalesforcePartner> implements IPartnerRepository {
    constructor() {
        super("Acc_ProjectParticipant__c", fields);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
        return super.whereFilter(x => x.Acc_ProjectId__c = projectId);
    }

    getById(partnerId: string): Promise<ISalesforcePartner | null> {
        return super.filterOne(x => x.Id = partnerId);
    }
}
