import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimDetails {
    Acc_CostCategory__c: string;
    Acc_PeriodCostCategoryTotal__c: number;
    Acc_ProjectParticipant__c: string;
    Acc_ProjectPeriodNumber__c: number,
}

const fields = [
    "Acc_CostCategory__c",
    "Acc_PeriodCostCategoryTotal__c",
    "Acc_ProjectParticipant__c",
    "Acc_ProjectPeriodNumber__c",
];

export interface IClaimDetailsRepository {
    getAllByPartnerId(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
    getAllPreviousByPartnerId(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
}

export class ClaimDetailsRepository extends SalesforceBase<ISalesforceClaimDetails> implements IClaimDetailsRepository {
    private recordType: string = "Claims Detail";
    constructor() {
        super("Acc_Claims__c", fields);
    }

    getAllByPartnerId(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
        const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c = ${periodId}`;
        return super.whereString(filter);
    }

    getAllPreviousByPartnerId(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
        const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c < ${periodId}`;
        return super.whereString(filter);
    }
}
