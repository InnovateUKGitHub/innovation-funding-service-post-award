import SalesforceBase from "./salesforceBase";
import { range } from "../../shared/range";

export interface ISalesforcePartner {
    Id: string,
    AccountId: string;
    ParticipantName__c: string;
    ParticipantType__c: string;
    ParticipantSize__c: string;
    ProjectRole__c: string;
    AuditReportFrequency__c: string;
    ParticipantStatus__c: string;
    ProjectId__c: string;
}


export interface IPartnerRepository {
    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]>;
}

export class PartnerRepository extends SalesforceBase<ISalesforcePartner> implements IPartnerRepository {
    constructor() {
        super("Partner", ["TODO"]);
    }

    getAllByProjectId(projectId: string): Promise<ISalesforcePartner[]> {
        return Promise.resolve(range(5).map((seed) => ({ 
            Id: "Partner" + seed,
            ParticipantName__c: "Partner Name " + seed + " for " + projectId,
            ParticipantType__c: "Type " + seed
          } as ISalesforcePartner )));
    }
}
