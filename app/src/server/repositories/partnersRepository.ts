import SalesforceBase, { Updatable } from "./salesforceBase";
import { Connection } from "jsforce";

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
    Acc_Cap_Limit__c: number;
    Acc_Award_Rate__c: number;
    Acc_TotalFutureForecastsforParticipant__c: number;
    Acc_ForecastLastModifiedDate__c: string;
}

const fields = [
    "Id",
    "Acc_AccountId__r.Id",
    "Acc_AccountId__r.Name",
    "Acc_ParticipantType__c",
    "Acc_ParticipantSize__c",
    "Acc_TotalParticipantGrant__c",
    "Acc_TotalParticipantCosts__c",
    "Acc_Cap_Limit__c",
    "Acc_Award_Rate__c",
    "Acc_ProjectRole__c",
    "Acc_ProjectId__c",
    "Acc_TotalFutureForecastsforParticipant__c",
    "Acc_ForecastLastModifiedDate__c",
];

export interface IPartnerRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]>;
    getById(partnerId: string): Promise<ISalesforcePartner>;
    update(updatedPartner: Updatable<ISalesforcePartner>): Promise<boolean>;
    getAll(): Promise<ISalesforcePartner[]>;
}

export class PartnerRepository extends SalesforceBase<ISalesforcePartner> implements IPartnerRepository {
    constructor(connection: () => Promise<Connection>) {
        super(connection, "Acc_ProjectParticipant__c", fields);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
        return super.where({ Acc_ProjectId__c: projectId });
    }

    getById(partnerId: string): Promise<ISalesforcePartner> {
        return super.loadItem({ Id: partnerId });
    }

    update(updatedPartner: Updatable<ISalesforcePartner>) {
      return super.update(updatedPartner);
    }

    getAll() {
      return super.all();
    }
}

export const PROJECT_LEAD_IDENTIFIER = "Project Lead";
