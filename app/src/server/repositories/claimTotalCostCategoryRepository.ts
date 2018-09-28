import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimTotalCostCategory {
    Acc_CostCategory__c: string;
    Acc_CostCategoryTotal__c: number;
}

const fields = [
    "Acc_CostCategory__c",
    "Acc_CostCategoryTotal__c"
];

export interface IClaimTotalCostCategoryRepository {
    getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]>;
    recordType: string;
}

export class ClaimTotalCostCategoryRepository extends SalesforceBase<ISalesforceClaimTotalCostCategory> implements IClaimTotalCostCategoryRepository {
    recordType: string = "Total Cost Category";
    constructor() {
        super("Acc_Claims__c", fields);
    }

    getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]> {
        const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
        return super.whereString(filter);
    }
}
