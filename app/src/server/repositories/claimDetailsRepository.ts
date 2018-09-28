import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimDetails {
    Acc_CostCategory__c: string;
    Acc_PeriodCostCategoryTotal__c: number;
}

const fields = [
    "Acc_CostCategory__c",
    "Acc_PeriodCostCategoryTotal__c"
];

export interface IClaimDetailsRepository {
    getAllByPartnerId(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
    recordType: string;
}

export class ClaimDetailsRepository extends SalesforceBase<ISalesforceClaimDetails> implements IClaimDetailsRepository {
    recordType: string = "Claims Detail";
    constructor() {
        super("Acc_Claims__c", fields);
    }

    getAllByPartnerId(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
        const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodId__c = ${periodId}`;
        return super.whereString(filter);
    }
}
