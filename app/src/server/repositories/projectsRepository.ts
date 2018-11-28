import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

export interface ISalesforceProject {
    Id: string;
    Name: string;
    Acc_ClaimFrequency__c: string;
    Acc_Duration__c: number;
    Acc_EndDate__c: string;
    Acc_GOLTotalCostAwarded__c: number;
    Acc_IFSApplicationId__c: number;
    Acc_LegacyID__c: string;
    Acc_MonitoringLevel__c: string;
    Acc_MonitoringReportSchedule__c: string;
    Acc_OfferLetterDate__c: string;
    Acc_ProjectActivityCode__c: string;
    Acc_ProjectNumber__c: string;
    Acc_ProjectSource__c: string;
    Acc_ProjectStatus__c: string;
    Acc_ProjectSummary__c: string;
    Acc_ProjectTitle__c: string;
    Acc_PublicDescription__c: string;
    Acc_StartDate__c: string;
    Acc_TotalProjectCosts__c: number;
}

const fields = [
    "Id",
    "Name",
    "Acc_ClaimFrequency__c",
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
    "Acc_TotalProjectCosts__c"
];

export interface IProjectRepository {
    getById(id: string): Promise<ISalesforceProject|null>;
    getAll(): Promise<ISalesforceProject[]>;
}

export class ProjectRepository extends SalesforceBase<ISalesforceProject> implements IProjectRepository {
    constructor(connection: () => Promise<Connection>) {
        super(connection, "Acc_Project__c", fields);
    }

    getById(id: string) {
        return super.filterOne({Id: id});
    }

    getAll() {
        return super.all();
    }
}
