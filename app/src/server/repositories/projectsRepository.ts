import SalesforceBase from "./salesforceBase";

export interface ISalesforceProject {
    Id: string,
    Name: string,
    Acc_ClaimFrequency__c: string,
    Acc_CompetitionId__c: string,
    Acc_CompetitionCode__c: string,
    Acc_Duration__c: number,
    Acc_EndDate__c: string,//Date,
    Acc_GOLTotalCostAwarded__c: number,
    Acc_IFSApplicationId__c: number,
    Acc_LegacyID__c: string,
    Acc_MonitoringLevel__c: string,
    Acc_MonitoringReportSchedule__c: string,
    Acc_OfferLetterDate__c: string,
    Acc_ProjectActivityCode__c: string,
    Acc_ProjectNumber__c: string,
    Acc_ProjectSource__c: string,
    Acc_ProjectStatus__c: string,
    Acc_ProjectSummary__c: string,
    Acc_ProjectTitle__c: string,
    Acc_PublicDescription__c: string,
    Acc_StartDate__c: string,//Date,
}

const fields = [
    "Id",
    "Name",
    "Acc_ClaimFrequency__c",
    "Acc_CompetitionId__c",
    "Acc_CompetitionCode__c",
    "Acc_Duration__c",
    "Acc_EndDate__c",
    "Acc_GOLTotalCostAwarded__c",
    "Acc_IFSApplicationId__c",
    "Acc_LegacyID__c",
    "Acc_MonitoringLevel__c",
    "Acc_MonitoringReportSchedule__c",
    "Acc_OfferLetterDate__c",
    "Acc_ProjectActivityCode__c",
    "Acc_ProjectNumber__c",
    "Acc_ProjectSource__c",
    "Acc_ProjectStatus__c",
    "Acc_ProjectSummary__c",
    "Acc_ProjectTitle__c",
    "Acc_PublicDescription__c",
    "Acc_StartDate__c",
];

export interface IProjectRepository {
    getById(id: string): Promise<ISalesforceProject|null>;
    getAll(): Promise<ISalesforceProject[]>;
}

export class ProjectRepository extends SalesforceBase<ISalesforceProject> implements IProjectRepository {
    constructor() {
        super("Acc_Project__c", fields);
    }

    getById(id: string) {
        return super.retrieve(id);
    }

    getAll() {
        return super.all();
    }
}
