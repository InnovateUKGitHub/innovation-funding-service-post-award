import SalesforceBase from "./salesforceBase";

export interface ISalesforceProject {
    CreatedById: string,
    CreatedDate: Date,
    Id: string,
    IsDeleted: string,
    LastActivityDate: Date,
    LastModifiedById: string,
    LastModifiedDate: Date,
    Name: string,
    OwnerId: string,
    SystemModstamp: Date,
    ProjectNumber__c: string,
    LegacyId__c: string,
    IfsApplicationId__c: number,
    ProjectActivityCode__c: string,
    ProjectTitle__c: string,
    ProjectSummary__c: string,
    PublicDescripton__c: string,
    OfferLetterDate__c: Date,
    StartDate__c: Date,
    EndDate__c: Date,
    ClaimFrequency__c: "Month" | "Qtr" | "Year",
    ProjectSource__c: "IFS" | "Migration" | "Other",
    Duration__c: number,
    GolTotalCostAwarded__c: number,
    ProjectStatus__c: "Active" | "Not Active",
    Competetion__c: string,
    EstimatedFinaltotal__c: number,
    ForecastUnderspendFromGOLTotal__c: number,
    GolTotalCostsAwarded__c: number,
    TotalAwaitingPayment__c: number,
    TotalCostsClaimedPriorPeriod__c: number,
    TotalCurrentAndFuturePeriodForecast__c: number,
    TotalCurrentClaimPeriodForecast__c: number,
    TotalFuturePeriodForecast_c: number,
    TotalInitialForecast__c: number,
    UnderspendFromInitialForecast__c: number,
}

export interface IProjectRepository {
    getById(id: string): Promise<ISalesforceProject>;
}

export class ProjectRepository extends SalesforceBase<ISalesforceProject> implements IProjectRepository {
    constructor() {
        super("Project__c", ["TODO"]);
    }

    getById(id: string) {
        //return super.retrieve(id);
        return Promise.resolve({
            Id: id, 
            Name: "Project " + id,
            ProjectTitle__c : "Project Title",
            ProjectSummary__c: "Project Summary",
            Competetion__c: "Competition Title",
            StartDate__c: new Date("2017/12/25"),
            EndDate__c: new Date("2017/12/25"),
        } as any as ISalesforceProject);
    }
}
