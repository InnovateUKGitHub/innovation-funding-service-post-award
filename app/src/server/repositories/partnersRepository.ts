import SalesforceBase from "./salesforceBase";
import { range } from "../../shared/range";

export interface ISalesforcePartner {
    Id: string;
    AccountId: string;
    ParticipantName__c: string;
    ParticipantType__c: string;
    ParticipantSize__c: string;
    ProjectRole__c: string;
    // AuditReportFrequency__c: string;
    // ParticipantStatus__c: string;
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
        const hardCoded: ISalesforcePartner[] = [
            {
                Id: "0011w0000031Y07AAE",
                AccountId: "Ooba",
                ParticipantName__c: "Ooba",
                ParticipantType__c: "Industrial",
                ProjectRole__c: "Lead",
                ParticipantSize__c: "Small",
                ProjectId__c: projectId,
            },
            {
                Id: "0011w0000031Y08AAE",
                AccountId: "Gabtype",
                ParticipantName__c: "Gabtype",
                ParticipantType__c: "Industrial",
                ProjectRole__c: "Not Lead",
                ParticipantSize__c: "Small",
                ProjectId__c: projectId,
            },
            {
                Id: "0011w0000031Y17AAE",
                AccountId: "Jabbertype",
                ParticipantName__c: "Jabbertype",
                ParticipantType__c: "Industrial",
                ProjectRole__c: "Not Lead",
                ParticipantSize__c: "Small",
                ProjectId__c: projectId,
            },
            {
                Id: "0011w0000031Y10AAE",
                AccountId: "Wordpedia",
                ParticipantName__c: "Wordpedia",
                ParticipantType__c: "Academic",
                ProjectRole__c: "Not Lead",
                ParticipantSize__c: "Small",
                ProjectId__c: projectId,
            }
        ];
        return Promise.resolve(hardCoded);
    }
}
