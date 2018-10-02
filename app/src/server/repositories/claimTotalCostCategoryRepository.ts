import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimTotalCostCategory {
    Acc_CostCategory__c: string;
    Acc_CostCategoryTotal__c: number;
    Acc_ProjectParticipant__c: string;
}

const fields = [
    "Acc_CostCategory__c",
    "Acc_CostCategoryTotal__c",
    "Acc_ProjectParticipant__c",
];

export interface IClaimTotalCostCategoryRepository {
    getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]>;
}

export class ClaimTotalCostCategoryRepository extends SalesforceBase<ISalesforceClaimTotalCostCategory> implements IClaimTotalCostCategoryRepository {
    private recordType: string = "Total Cost Category";

    constructor() {
        super("Acc_Claims__c", fields);
    }

    getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]> {
        const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
        return super.whereString(filter);
    }
}
