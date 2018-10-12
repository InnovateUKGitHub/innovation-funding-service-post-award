import SalesforceBase from "./salesforceBase";

export interface ISalesforceCostCategory {
    Id: string;
    Acc_CostCategoryName__c: string;
    Acc_DisplayOrder__c: number;
    Acc_OrganisationType__c: string;
    Acc_CompetitionType__c: string;
    Acc_CostCategoryDescription__c: string;
    Acc_HintText__c: string;
}

const fieldNames: string[] = [
    "Id",
    "Acc_CostCategoryName__c",
    "Acc_DisplayOrder__c",
    "Acc_OrganisationType__c",
    "Acc_CompetitionType__c",
    "Acc_CostCategoryDescription__c",
    // ToDo: currently missing on poc2 ... should be fixed soon
    // "Acc_HintText__c"
];

export interface ICostCategoryRepository {
    getAll(): Promise<ISalesforceCostCategory[]>;
}

export class CostCategoryRepository extends SalesforceBase<ISalesforceCostCategory> implements ICostCategoryRepository {
    constructor() {
        super("Acc_CostCategory__c", fieldNames);
    }

    getAll(): Promise<ISalesforceCostCategory[]> {
        return super.all();
    }
}
