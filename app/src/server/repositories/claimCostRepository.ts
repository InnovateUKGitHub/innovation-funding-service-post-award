import SalesforceBase from "./salesforceBase";
import {DateTime, Duration} from "luxon";

export interface ISalesforceClaimCost {
    Id: string;
    ACC_Claim_Id__c: string;
    Acc_PeriodStartDate_c : string;
    Acc_PeriodEndDate__c : string;
    Acc_PeriodID__c : number,
    Acc_ProjectPeriodLongName__c : string;
    RecordType : string;
    Acc_CostCategoryID__c : number;
    Acc_ProjectParticipantID__c : string;
    Acc_ForecastInitialValue__c : number;
    Acc_ForecastLatestValue__c : number;
    Acc_GolValue__c : number;
    Acc_TotalCostCategoryValue__c : number;
    Acc_TotalValue__c : number;
    Acc_TotalGolvalue__c : number;
    Acc_TotalFutureCostCategoryValue__C: number;
}

const fieldNames: string[] = [];

export interface IClaimCostRepository {
    getAllForClaim(claimId: string): Promise<ISalesforceClaimCost[]>;
}

const fakeCCNames = ["Labour", "Overheads", "Materials", "Capital usage", "Subcontracting", "Travel and subsistence", "Other costs" ];

export class ClaimCostRepository extends SalesforceBase<ISalesforceClaimCost> implements IClaimCostRepository {
    
    constructor(){
        super("Acc_Cost__c", fieldNames)
        this.now = DateTime.fromJSDate(new Date());
        this.start = this.now.minus({days: this.now.day - 1});
        this.end = this.start.plus({ days: this.start.daysInMonth - 1});
    }

    private now:DateTime;
    private start: DateTime;
    private end: DateTime;

    public getAllForClaim(claimId: string): Promise<ISalesforceClaimCost[]> {
        return Promise.resolve(fakeCCNames.map((name, index) => this.fakeCost(name, claimId, index + 1)));
    }

    private fakeCost(category:string, claimId: string, seed: number ) : ISalesforceClaimCost {
        return {
            Id: `ClaimCost${seed}`,
            ACC_Claim_Id__c: claimId,
            Acc_CostCategoryID__c: seed,
            Acc_PeriodStartDate_c : this.start.toFormat("DD/MM/YYYY"),
            Acc_PeriodEndDate__c : this.end.toFormat("DD/MM/YYYY"),
            Acc_PeriodID__c : 1,
            Acc_ProjectPeriodLongName__c : `P1 ${this.start.toFormat("d MMM")} to ${this.end.toFormat("d MMM YYYY")}`,
            RecordType : "",
            Acc_ProjectParticipantID__c : "",
            Acc_ForecastInitialValue__c : seed * 120,
            Acc_ForecastLatestValue__c : seed * 150,
            Acc_GolValue__c : seed * 250,
            Acc_TotalCostCategoryValue__c : seed * 124,
            Acc_TotalValue__c : seed * 502,
            Acc_TotalGolvalue__c : seed * 683,
            Acc_TotalFutureCostCategoryValue__C: seed * 124,
        };
    }
}