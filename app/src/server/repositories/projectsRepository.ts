import SalesforceBase from "./salesforceBase";

export interface ISalesforceProject {
    Id: string,
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
        const hardCoded = {
            Id: id,
            ProjectTitle__c: "123: High speed rail and its effects on air quality",
            StartDate__c: new Date("2019/12/1"),
            EndDate__c: new Date("2033/12/24"),
            ProjectSummary__c: "The project aims to identify, isolate and correct an issue that has hindered progress in this field for a number of years.\n" +
                "Identification will involve the university testing conditions to determine the exact circumstance of the issue.\n" +
                "Once identification has been assured we will work to isolate the issue but replicating the circumstances in which it occurs within a laboratory environment.\n" +
                "After this we will work with our prototyping partner to create a tool to correct the issue.  Once tested and certified this will be rolled out to mass production.\n",
        } as any as ISalesforceProject;

        return Promise.resolve(hardCoded);
    }
}
