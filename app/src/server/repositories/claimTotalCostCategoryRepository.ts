import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

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
    private readonly recordType: string = "Total Cost Category";

    constructor(connection: () => Promise<Connection>) {
        super(connection, "Acc_Claims__c", fields);
    }

    getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]> {
        const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
        return super.where(filter);
    }
}
